// js/shoppingCart.js
// Este script controla a página do carrinho de compras (cart.html).

// --- 1. Seleção de Elementos ---
const showItems = document.querySelector('#showItems'); // Coluna da esquerda (lista de itens)
// Coluna da direita (resumo financeiro)
const showAllItemsValue = document.querySelector('#showAllItemsValue');
const showDelivery = document.querySelector('#showDelivery');
const showDiscount = document.querySelector('#showDiscount');
const showTotal = document.querySelector('#showTotal');
const inputPromotionCode = document.querySelector('#promotionCode');
const btnAddPromotionCode = document.querySelector('#addPromotionCode');
const btnWantDelivery = document.querySelector('#wantDelivery');
const btnDontWantDelivery = document.querySelector('#dontWantDelivery');
const btnGenerateOrder = document.querySelector('#generateOrder'); // Botão "Enviar Pedido"

// --- 2. Funções Auxiliares de localStorage ---
const getCart = () => JSON.parse(localStorage.getItem('cart')) || [];
const setCart = cartData => localStorage.setItem('cart', JSON.stringify(cartData));

// --- 3. Variáveis Globais ---
let cart; // Array com os produtos completos (do localStorage + API)
let itemsToShow; // String HTML dos itens do carrinho
let allItemsValue; // Subtotal (valor dos itens)
let deliveryValue = 0; // Valor da entrega
let discountValue = 0; // Porcentagem de desconto
const promotionCode = 'easteregg'; // Código de cupom

let allProducts = []; // Array para "cachear" os produtos vindos da API

// --- 4. Funções Principais ---

/**
 * Gera o carrinho completo.
 * Pega os IDs/Qtds do localStorage e busca os detalhes (preço, nome, img)
 * do 'allProducts' (cache da API).
 */
const generateCart = () => {
    const cartItems = getCart(); // Pega (ex: [{id: 1, qtd: 2}])

    cart = []; // Reseta o carrinho
    allItemsValue = 0; // Reseta o subtotal

    cartItems.forEach(prod => {
        // Encontra o produto completo no nosso cache 'allProducts'
        const item = allProducts.find(element => element.id === prod.id);
        
        if (item) {
            // Se o produto ainda existe (não foi removido do banco)
            item.qtd = prod.qtd; // Adiciona a quantidade ao objeto
            allItemsValue += item.price * item.qtd; // Calcula o subtotal
            cart.push(item);
        }
    });

    return cart; // Retorna o array de produtos completos
};

// Constrói o HTML de um item no carrinho
const addItemToItemsToShow = prod => {
    const price = (prod.price * prod.qtd).toFixed(2).toString().replace('.', ',');
    itemsToShow += `
    <div class="item">
        <img src="../img/${prod.img}" alt="Imagem de um(a) ${prod.name}">
        <div>
            <p class="title">${prod.name}</p>
            <p>${prod.description}</p>
            <div class="bottom">
                <div class="counter">
                    <button onclick="remItem(${prod.id})">-</button>
                    <input type="text" value="${prod.qtd}" disabled>
                    <button onclick="addItem(${prod.id})">+</button>
                </div>
                <p class="price">R$ <span>${price}</span></p>
            </div>
        </div>
    </div>
    <hr>`;
};

// --- 5. Funções de Interação (chamadas pelos botões) ---

// Adiciona +1 a um item no carrinho
const addItem = id => {
    const cartItems = getCart();
    const newCartItems = [];
    cartItems.forEach(item => {
        if (item.id === id) newCartItems.push({ id: item.id, qtd: item.qtd + 1 });
        else newCartItems.push({ id: item.id, qtd: item.qtd });
    });
    setCart(newCartItems); // Salva no localStorage
    renderPage(); // Re-renderiza a página inteira
};

// Remove -1 de um item no carrinho
const remItem = id => {
    const cartItems = getCart();
    const newCartItems = [];
    cartItems.forEach(item => {
        if (item.id === id && item.qtd > 1) // Se for > 1, diminui
            newCartItems.push({ id: item.id, qtd: item.qtd - 1 });
        else if (item.id === id && item.qtd <= 1) // Se for 1, não faz nada (e mostra notificação)
            itemRemovedNotification.showToast();
        else // Outros itens
            newCartItems.push({ id: item.id, qtd: item.qtd });
    });
    setCart(newCartItems); // Salva no localStorage
    renderPage(); // Re-renderiza a página
};

// Escolhe o tipo de entrega (Delivery ou Retirada)
const chooseDelivery = option => {
    if (option) { // Delivery
        btnWantDelivery.classList.add('active');
        btnDontWantDelivery.classList.remove('active');
        deliveryValue = 3;
    } else { // Retirada
        btnWantDelivery.classList.remove('active');
        btnDontWantDelivery.classList.add('active');
        deliveryValue = 0;
    }
    renderPage(); // Re-renderiza a página (para atualizar o total)
};

// Adiciona o cupom de desconto
const addDiscount = () => {
    const code = inputPromotionCode.value.trim().toLowerCase();
    if (code === promotionCode) {
        discountValue = 15; // 15%
        appliedCode.showToast();
        renderPage(); // Re-renderiza (para atualizar o total)
    } else codeNotFound.showToast();
};

/**
 * Função: Renderizar a Página
 * Esta é a função central que redesenha a página.
 * Ela é chamada por 'init', 'addItem', 'remItem', 'chooseDelivery' e 'addDiscount'.
 */
const renderPage = () => {
    const generatedCart = generateCart(); // Pega os dados do localStorage + API
    // Ordena os itens por tipo (Lanche, Combo, etc.)
    generatedCart.length > 0 && generatedCart.sort((a, b) => a.type < b.type ? -1 : a.type > b.type ? 1 : 0 );

    itemsToShow = '';
    showItems.innerHTML = '';

    if (generatedCart.length > 0)
        generatedCart.forEach(data => addItemToItemsToShow(data)); // Constrói o HTML
    else
        itemsToShow = '<p>Você ainda não adicionou itens no carrinho.</p>';

    showOnPage(); // Atualiza os valores (Subtotal, Taxa, Desconto, Total)
};

/**
 * Função de Inicialização (Main)
 * Busca os produtos da API e, QUANDO TERMINAR, renderiza a página.
 */
async function init() {
    try {
        // Busca os produtos na API e salva no "cache" 'allProducts'
        const response = await fetch('http://localhost:3001/api/products');
        allProducts = await response.json();
        
        // Agora que temos os produtos, renderizamos a página
        renderPage();
    } catch (error) {
        console.error('Erro ao buscar produtos da API:', error);
        showItems.innerHTML = '<p>Erro ao carregar o carrinho. Tente recarregar a página.</p>';
    }
}

// Atualiza os valores do resumo financeiro (coluna da direita)
const showOnPage = () => {
    showItems.innerHTML = itemsToShow; // Mostra os itens (coluna da esquerda)
    
    // Calcula os totais
    const totalValue = allItemsValue + deliveryValue; // Total antes do desconto
    const discountAmount = (totalValue * discountValue) / 100;
    const finalTotal = totalValue - discountAmount;

    // Mostra os valores formatados
    showAllItemsValue.innerHTML = 'R$ ' + allItemsValue.toFixed(2).toString().replace('.', ',');
    showDelivery.innerHTML = '+ R$ ' + deliveryValue.toFixed(2).toString().replace('.', ',');
    showDiscount.innerHTML = '- R$ ' + discountAmount.toFixed(2).toString().replace('.', ',');
    showTotal.innerHTML = 'R$ ' + finalTotal.toFixed(2).toString().replace('.', ',');
};

/**
 * Função: Enviar Pedido para o Back-end
 * Chamada pelo botão "Gerar Pedido".
 */
const generateOrder = async () => { // Função assíncrona
    const generatedCart = generateCart();

    if (generatedCart.length === 0) {
        return noItemsInCart.showToast(); // Não envia se o carrinho estiver vazio
    }

    // 1. Coleta os dados finais para enviar
    const totalValue = allItemsValue + deliveryValue;
    const finalPrice = totalValue - ((totalValue * discountValue)/100);
    const deliveryType = deliveryValue > 0 ? 'Delivery' : 'Retirada no local';

    // 2. Monta o "payload" (pacote de dados) para o back-end
    const orderData = {
        items: generatedCart.map(item => ({ // Envia só os dados necessários
            id: item.id,
            qtd: item.qtd,
            price: item.price
        })),
        deliveryType: deliveryType,
        discount: discountValue,
        finalPrice: finalPrice
    };

    try {
        // 3. Envia para o back-end usando fetch (POST)
        const response = await fetch('http://localhost:3001/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData), // Transforma o pacote em texto JSON
        });

        const result = await response.json();

        // 4. Se o back-end confirmar (result.success == true)
        if (result.success) {
            alert('Pedido enviado com sucesso! O admin já foi notificado.');
            // (Opcional) Limpa o carrinho e recarrega
            setCart([]);
            window.location.href = '../index.html';
        } else {
            alert('Houve um erro ao enviar seu pedido.');
        }

    } catch (error) {
        console.error('Erro ao enviar pedido:', error);
        alert('Falha na conexão com o servidor. Tente novamente.');
    }
};

// --- 6. Notificações (Toastify) ---
// (Configurações das várias mensagens de notificação)

const itemRemovedNotification = Toastify({ /* ... */ });
const appliedCode = Toastify({ /* ... */ });
const codeNotFound = Toastify({ /* ... */ });
const noItemsInCart = Toastify({ /* ... */ });

// --- 7. Event Listeners ---
// Atribui as funções aos cliques nos botões
btnAddPromotionCode.addEventListener('click', addDiscount);
btnWantDelivery.addEventListener('click', function () { chooseDelivery(true); });
btnDontWantDelivery.addEventListener('click', function () { chooseDelivery(false); });
btnGenerateOrder.addEventListener('click', generateOrder);

// --- 8. Execução Inicial ---
// Chama a função 'init' para buscar os produtos e iniciar a página
init();

// Easter Egg
console.log('Você achou o Easter Egg do site =D\nUse o cupom EASTEREGG e ganhe 15% de desconto!');