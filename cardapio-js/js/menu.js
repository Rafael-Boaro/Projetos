// js/menu.js (CÓDIGO CORRETO DE FRONT-END)

// Getting from HTML
const menu = document.querySelector('#showMenu');
const promotions = document.querySelector('#showPromotions');

// Buttons show menu
const showAll = document.querySelector('#showAll');
const showSnacks = document.querySelector('#showSnacks');
const showCombos = document.querySelector('#showCombos');
const showPortions = document.querySelector('#showPortions');
const showDrinks = document.querySelector('#showDrinks');

// Items
let items;
let allProducts = []; // --- NOVO: Vamos guardar os produtos da API aqui

// --- NOVO: Função para buscar os produtos da nossa API ---
async function fetchProducts() {
    try {
        const response = await fetch('http://localhost:3001/api/products');
        allProducts = await response.json();
        
        // Assim que buscar, renderiza o menu inicial
        showProducts(0);
        allPromotions();
    } catch (error) {
        console.error('Erro ao buscar produtos da API:', error);
        menu.innerHTML = '<p>Erro ao carregar o cardápio. Tente recarregar a página.</p>';
    }
}

// Functions
const clearItems = type => {
    items = '';

    if (type === 'normal')
        menu.innerHTML = '';
    else
        promotions.innerHTML = '';
};

const removeClasses = () => {
    showAll.classList.remove('active');
    showSnacks.classList.remove('active');
    showCombos.classList.remove('active');
    showPortions.classList.remove('active');
    showDrinks.classList.remove('active');
};

const checkIfHaveItem = items => {
    if (items === '')
        menu.innerHTML = '<p>Nenhum produto encontrado!</p>';
    else
        menu.innerHTML = items;
};

const addItemToArray = prod => {
    let price = prod.price.toFixed(2).toString().replace('.', ',');

    items +=
        `<div class="card">
            <div>
                <div class="cardImg">
                    <img src="./img/${prod.img}" alt="Imagem de um(a) ${prod.name}">
                </div>
                <h4>${prod.name}</h4>
                <p>${prod.description}</p>
            </div>
            <div>
                <p class="price">R$ <span>${price}</span></p>
                <button class="btn" onclick="addToCart(${prod.id})">
                    <span class="iconify-inline" data-icon="mdi:cart-plus"></span> Adicionar
                </button>
            </div>
        </div>`;
};

// --- MODIFICADO: Agora usa 'allProducts' ---
const showProducts = type => {
    clearItems('normal');

    if (type === 0) {
        allProducts.forEach(prod => {
            if (prod.lastPrice === 0)
                addItemToArray(prod);
        });
    } else {
        allProducts.forEach(prod => {
            if (prod.type === type && prod.lastPrice === 0)
                addItemToArray(prod);
        });
    }

    checkIfHaveItem(items);
    removeClasses();

    if (type === 0)
        showAll.classList.add('active');
    else if (type === 1)
        showSnacks.classList.add('active');
    else if (type === 2)
        showCombos.classList.add('active');
    else if (type === 3)
        showPortions.classList.add('active');
    else if (type === 4)
        showDrinks.classList.add('active');
};

// --- MODIFICADO: Agora usa 'allProducts' ---
const allPromotions = () => {
    clearItems('promotions');

    allProducts.forEach(prod => {
        if (prod.lastPrice && prod.lastPrice != 0) {
            let price = prod.price.toFixed(2).toString().replace('.', ',');
            let lastPrice = prod.lastPrice.toFixed(2).toString().replace('.', ',');

            items +=
            `<div class="card">
                <div>
                    <div class="cardImg">
                        <img src="./img/${prod.img}" alt="Imagem de um(a) ${prod.name}">
                    </div>
                    <h4>${prod.name}</h4>
                    <p>${prod.description}</p>
                </div>
                <div>
                    <p class="lastPrice">R$ <span>${lastPrice}</span></p>
                    <p class="price">R$ <span>${price}</span></p>
                    <button class="btn" onclick="addToCart(${prod.id})">
                        <span class="iconify-inline" data-icon="mdi:cart-plus"></span> Adicionar
                    </button>
                </div>
            </div>`;
        }
    });

    if (items === '')
        promotions.innerHTML = '<p>Nenhuma promoção hoje, tente novamente amanhã! =(</p>';
    else
        promotions.innerHTML = items;
};

//Capturing button clicks
showAll.addEventListener('click', function () { showProducts(0); });
showSnacks.addEventListener('click', function () { showProducts(1); });
showCombos.addEventListener('click', function () { showProducts(2); });
showPortions.addEventListener('click', function () { showProducts(3); });
showDrinks.addEventListener('click', function () { showProducts(4); });

// --- MODIFICADO: Em vez de rodar direto, chamamos nossa nova função ---
fetchProducts();