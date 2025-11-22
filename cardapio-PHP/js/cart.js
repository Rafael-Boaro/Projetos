// /js/cart.js (NOVO ARQUIVO)

// Espera o HTML carregar antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELEÇÃO DOS ELEMENTOS ---
    const cart = []; // Array que vai guardar os produtos
    const cartBtnDesktop = document.getElementById('cart-btn-desktop');
    const cartBtnMobile = document.getElementById('cart-btn-mobile');
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    const cartCountDesktop = document.getElementById('cart-count-desktop');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    const allAddToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const sendOrderBtn = document.getElementById('send-order-btn');
    const whatsappNumber = document.getElementById('whatsapp-number').value;
    
    // --- 2. FUNÇÕES PRINCIPAIS ---

    // Função para ABRIR o modal
    function openCartModal() {
        cartModal.classList.add('active');
        cartOverlay.classList.add('active');
        updateCartModal(); // Atualiza o conteúdo ao abrir
    }

    // Função para FECHAR o modal
    function closeCartModal() {
        cartModal.classList.remove('active');
        cartOverlay.classList.remove('active');
    }

    // Função para ADICIONAR item ao carrinho
    function addToCart(event) {
        const button = event.target;
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);

        // Verifica se o item já está no carrinho
        const existingItem = cart.find(item => item.id === id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ id, name, price, quantity: 1 });
        }

        // Feedback visual para o usuário
        Toastify({
            text: `"${name}" adicionado ao carrinho!`,
            duration: 3000,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
        }).showToast();

        updateCartModal();
        updateCartCount();
    }
    
    // Função para ATUALIZAR O CONTEÚDO do modal
    function updateCartModal() {
        cartBody.innerHTML = ''; // Limpa o carrinho
        let total = 0;

        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
            cartTotal.textContent = 'R$ 0,00';
            return;
        }

        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <div class="item-info">
                    <span class="item-name">${item.name}</span>
                    <span class="item-price">R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="item-control">
                    <button class="control-btn" data-index="${index}" data-action="decrease">-</button>
                    <span class="item-quantity">${item.quantity}</span>
                    <button class="control-btn" data-index="${index}" data-action="increase">+</button>
                    <button class="control-btn-remove" data-index="${index}">&times;</button>
                </div>
            `;
            cartBody.appendChild(itemElement);
        });

        cartTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Função para ATUALIZAR CONTAGEM (bolinha vermelha)
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountDesktop.textContent = totalItems;
        cartCountMobile.textContent = totalItems;
    }
    
    // Função para MUDAR QUANTIDADE (dentro do modal)
    function handleQuantityChange(event) {
        const target = event.target;
        if (!target.classList.contains('control-btn')) return;

        const index = target.dataset.index;
        const action = target.dataset.action;
        const item = cart[index];

        if (action === 'increase') {
            item.quantity++;
        } else if (action === 'decrease') {
            item.quantity--;
            if (item.quantity <= 0) {
                cart.splice(index, 1); // Remove o item
            }
        }
        
        updateCartModal();
        updateCartCount();
    }
    
    // Função para REMOVER item
    function handleRemoveItem(event) {
        const target = event.target;
        if (!target.classList.contains('control-btn-remove')) return;

        const index = target.dataset.index;
        cart.splice(index, 1); // Remove o item
        
        updateCartModal();
        updateCartCount();
    }
    
    // Função para ENVIAR O PEDIDO via WhatsApp
    function sendToWhatsApp() {
        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        let message = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
        let total = 0;

        cart.forEach(item => {
            message += `*${item.quantity}x* ${item.name} - R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}\n`;
            total += item.price * item.quantity;
        });

        message += `\n*Total do Pedido: R$ ${total.toFixed(2).replace('.', ',')}*`;

        // Codifica a mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        window.open(url, '_blank');
    }

    // --- 3. EVENTOS (Onde a mágica acontece) ---
    
    // Abrir o carrinho
    cartBtnDesktop.addEventListener('click', openCartModal);
    cartBtnMobile.addEventListener('click', openCartModal);

    // Fechar o carrinho
    cartCloseBtn.addEventListener('click', closeCartModal);
    cartOverlay.addEventListener('click', closeCartModal);

    // Adicionar item ao carrinho
    allAddToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Controlar quantidade (+ ou -)
    cartBody.addEventListener('click', handleQuantityChange);
    
    // Remover item (o 'x' pequeno)
    cartBody.addEventListener('click', handleRemoveItem);
    
    // Enviar pedido
    sendOrderBtn.addEventListener('click', sendToWhatsApp);
});