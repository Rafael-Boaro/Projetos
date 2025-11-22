// Espera o HTML carregar e então busca os pedidos
document.addEventListener('DOMContentLoaded', () => {
    fetchOrders();
});

function getActionButtons(order) {
    const orderId = order.id;
    switch (order.order_status) {
        case 'Pendente':
            return `
                <div class="action-buttons">
                    <button class="btn-action btn-aceitar" data-id="${orderId}">Aceitar</button>
                    <button class="btn-action btn-cancelar" data-id="${orderId}">Cancelar</button>
                </div>
            `;
        case 'Em Preparo':
            return `
                <div class="action-buttons">
                    <button class="btn-action btn-finalizar" data-id="${orderId}">Finalizar</button>
                    <button class="btn-action btn-cancelar" data-id="${orderId}">Cancelar</button>
                </div>
            `;
        case 'Concluído':
            return `<span>Concluído</span>`;
        case 'Cancelado':
            return `<span>Cancelado</span>`;
        default:
            return `<span>-</span>`;
    }
}

async function fetchOrders() {
    const tbody = document.getElementById('ordersTbody');
    tbody.innerHTML = '<tr><td colspan="7">Carregando pedidos...</td></tr>';

    try {
        const response = await fetch('http://localhost:3001/api/orders', { 
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Falha na autorização. Redirecionando para login...');
        }
        
        const orders = await response.json(); // Converte a resposta

        tbody.innerHTML = ''; // Limpa a tabela

        if (orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7">Nenhum pedido encontrado.</td></tr>';
            return;
        }

        // Adiciona cada pedido na tabela
        orders.forEach(order => {
            const tr = document.createElement('tr'); // Cria a linha
            const date = new Date(order.created_at);
            const formattedDate = date.toLocaleString('pt-BR'); // Formata a data

            tr.innerHTML = `
                <td><a href="#" class="order-id-link" data-id="${order.id}">${order.id}</a></td>
                <td>${order.delivery_type}</td>
                <td>R$ ${order.discount.toFixed(2)}</td>
                <td>R$ ${order.final_price.toFixed(2)}</td>
                <td class="status-${order.order_status.toLowerCase()}">${order.order_status}</td>
                <td>${formattedDate}</td>
                <td>${getActionButtons(order)}</td> 
            `;
            tbody.appendChild(tr); // Adiciona a linha na tabela
        });

    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        tbody.innerHTML = `<tr><td colspan="7">${error.message}</td></tr>`;

        if (error.message.includes('autorização')) {
             setTimeout(() => { window.location.href = '/login.html'; }, 2000);
        }
    }
}

const tableBody = document.getElementById('ordersTbody');

tableBody.addEventListener('click', async (event) => {
    const target = event.target;

    if (target.classList.contains('btn-action')) {
        event.preventDefault();
        const button = target;
        const orderId = button.dataset.id;
        const tr = button.closest('tr');
        const statusCell = tr.querySelector('[class^="status-"]');
        const actionCell = button.closest('td');

        let endpoint = '';
        let newStatus = '';
        let newButtons = '';

        if (target.classList.contains('btn-aceitar')) {
            endpoint = `/api/orders/${orderId}/accept`;
            newStatus = 'Em Preparo';
            newButtons = getActionButtons({ id: orderId, order_status: 'Em Preparo' });
            
        } else if (target.classList.contains('btn-cancelar')) {
            endpoint = `/api/orders/${orderId}/cancel`;
            newStatus = 'Cancelado';
            newButtons = getActionButtons({ id: orderId, order_status: 'Cancelado' });
            
        } else if (target.classList.contains('btn-finalizar')) {
            endpoint = `/api/orders/${orderId}/complete`;
            newStatus = 'Concluído'; 
        }

        if (!endpoint) return;

        try {
            button.disabled = true;

            const response = await fetch(`http://localhost:3001${endpoint}`, {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {

                if (newStatus === 'Concluído' || newStatus === 'Cancelado') {
                    tr.style.opacity = '0';
                    tr.style.transition = 'opacity 0.5s ease-out';
                    setTimeout(() => tr.remove(), 500);
                } else {
                    statusCell.textContent = newStatus;
                    statusCell.className = `status-${newStatus.toLowerCase()}`;
                    actionCell.innerHTML = newButtons;
                }
                
            } else {
                alert('Falha ao atualizar o pedido. (Erro do servidor)');
                button.disabled = false;
            }

        } catch (error) {
            console.error('Erro ao enviar requisição:', error);
            alert('Falha na conexão ao tentar atualizar o pedido.');
            button.disabled = false;
        }
    }

    if (target.classList.contains('order-id-link')) {
        event.preventDefault(); 
        const link = target;
        const orderId = link.dataset.id;
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${orderId}/items`, {
                credentials: 'include'
            });
            const items = await response.json();
            if (response.ok) {
                let itemsText = `Itens do Pedido #${orderId}:\n\n`;
                items.forEach(item => {
                    itemsText += `${item.quantity}x ${item.name} (R$ ${item.item_price.toFixed(2)} cada)\n`;
                });
                alert(itemsText);
            } else {
                alert(items.error);
            }
        } catch (error) {
            alert('Falha ao buscar itens do pedido.');
        }
    }
});
document.addEventListener('DOMContentLoaded', () => {

    const productForm = document.getElementById('productForm');
    const productMessage = document.getElementById('product-message');
    const hiddenProductId = document.getElementById('productId');
    const productIdInput = document.getElementById('productIdInput');
    const productType = document.getElementById('productType');
    const productName = document.getElementById('productName');
    const productDesc = document.getElementById('productDesc');
    const productPrice = document.getElementById('productPrice');
    const productLastPrice = document.getElementById('productLastPrice');
    const productImage = document.getElementById('productImage');
    const currentImg = document.getElementById('currentImg');
    const btnClearForm = document.getElementById('btnClearForm');
    const fetchProducts = async () => {
        const tbodyLanches = document.getElementById('productsTbodyLanches');
        const tbodyCombos = document.getElementById('productsTbodyCombos');
        const tbodyPorcoes = document.getElementById('productsTbodyPorcoes');
        const tbodyBebidas = document.getElementById('productsTbodyBebidas');

        const tbodies = [tbodyLanches, tbodyCombos, tbodyPorcoes, tbodyBebidas];
        tbodies.forEach(tbody => {
            if (tbody) tbody.innerHTML = `<tr><td colspan="4">Carregando...</td></tr>`;
        });

        try {
            // 3. Busca os produtos na API
            const response = await fetch('http://localhost:3001/api/products', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Falha ao buscar produtos.');

            const products = await response.json();

            tbodies.forEach(tbody => { if (tbody) tbody.innerHTML = ''; });

            if (products.length === 0) {
                tbodies.forEach(tbody => { if (tbody) tbody.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>'; });
                return;
            }
            products.forEach(product => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>R$ ${product.price.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-edit" data-id="${product.id}">Editar</button>
                        <button class="btn-delete" data-id="${product.id}">Excluir</button>
                    </td>
                `;
                tr.dataset.product = JSON.stringify(product); 

                switch (String(product.type)) {
                    case '1': tbodyLanches.appendChild(tr); break;
                    case '2': tbodyCombos.appendChild(tr); break;
                    case '3': tbodyPorcoes.appendChild(tr); break;
                    case '4': tbodyBebidas.appendChild(tr); break;
                    default:
                        console.warn(`Produto ${product.id} com tipo desconhecido: ${product.type}`);
                        tbodyLanches.appendChild(tr);
                }
            });

        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
            tbodies.forEach(tbody => { if (tbody) tbody.innerHTML = `<tr><td colspan="4">${error.message}</td></tr>`; });
        }
    };

    const clearForm = () => {
        productForm.reset();
        hiddenProductId.value = '';
        currentImg.value = '';
        productIdInput.disabled = false;
        productMessage.textContent = '';
        productMessage.className = '';
    };

    const showMessage = (message, isError = false) => {
        productMessage.textContent = message;
        productMessage.className = isError ? 'error' : 'success';
        setTimeout(() => {
            productMessage.textContent = '';
            productMessage.className = '';
        }, 3000); 
    };

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData();

        formData.append('id', productIdInput.value);
        formData.append('type', productType.value);
        formData.append('name', productName.value);
        formData.append('description', productDesc.value);
        formData.append('price', parseFloat(productPrice.value));
        formData.append('lastPrice', parseFloat(productLastPrice.value) || 0);

        const imageFile = productImage.files[0];
        if (imageFile) {
            formData.append('productImage', imageFile, imageFile.name);
        }

        const currentProductId = hiddenProductId.value;
        let url = 'http://localhost:3001/api/products';
        let method = 'POST';

        if (currentProductId) {
            url = `http://localhost:3001/api/products/${currentProductId}`;
            method = 'PUT';
            formData.append('currentImg', currentImg.value);
        }

        try {
            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Erro desconhecido');
            }
            
            showMessage(result.message, false);
            clearForm();
            fetchProducts();

        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            showMessage(error.message, true);
        }
    });

    btnClearForm.addEventListener('click', clearForm);

    const crudContainer = document.querySelector('.crud-container');
    crudContainer.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('btn-edit')) {
            const tr = target.closest('tr');
            const product = JSON.parse(tr.dataset.product);

            hiddenProductId.value = product.id;
            productIdInput.value = product.id;
            productIdInput.disabled = true;
            productType.value = product.type;
            productName.value = product.name;
            productDesc.value = product.description;
            productPrice.value = product.price;
            productLastPrice.value = product.lastPrice;
            currentImg.value = product.img;
            productImage.value = null;

            productForm.scrollIntoView({ behavior: 'smooth' });
        }

        if (target.classList.contains('btn-delete')) {
            const productId = target.dataset.id;
            
            if (!confirm(`Tem certeza que deseja excluir o produto ID ${productId}?`)) {
                return;
            }

            try {
                const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const result = await response.json();

                if (!response.ok) throw new Error(result.error || 'Erro ao excluir');

                showMessage(result.message, false);
                fetchProducts();

            } catch (error) {
                console.error('Erro ao excluir produto:', error);
                showMessage(error.message, true);
            }
        }
    });

    fetchProducts();
});

const logoutButtonAdmin = document.getElementById('logoutButton');
if (logoutButtonAdmin) {
    logoutButtonAdmin.addEventListener('click', async () => {
        if (!confirm('Tem certeza que deseja sair?')) return;

        try {
            const response = await fetch('http://localhost:3001/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {
                window.location.href = '/login.html';
            } else {
                alert('Erro ao fazer logout.');
            }
        } catch (error) {
            alert('Erro de conexão ao tentar sair.');
        }
    });
}

const reportButton = document.getElementById('btnDailyReport');
if (reportButton) {
    reportButton.addEventListener('click', async () => {
        
        reportButton.disabled = true;
        reportButton.textContent = 'Gerando...';

        try {

            const response = await fetch('http://localhost:3001/api/reports/daily', {
                credentials: 'include'
            });
            const report = await response.json();

            if (report.success) {

                const revenue = report.totalRevenue.toFixed(2);
                const avg = report.avgTicket.toFixed(2);

                alert(
                    `--- Relatório do Dia ---\n\n` +
                    `Total de Pedidos Concluídos: ${report.totalOrders}\n` +
                    `Faturamento Total: R$ ${revenue}\n` +
                    `Ticket Médio: R$ ${avg}`
                );
            } else {
                alert('Erro ao gerar relatório. (Erro do servidor)');
            }

        } catch (error) {
            console.error('Erro ao buscar relatório:', error);
            alert('Erro de conexão ao buscar relatório.');
        }

        reportButton.disabled = false;
        reportButton.textContent = 'Relatório do Dia';
    });
}