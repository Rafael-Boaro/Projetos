document.addEventListener('DOMContentLoaded', () => {

    const config = STORE_DATA.config;
    const categories = STORE_DATA.categories;
    const products = STORE_DATA.products;

    const whatsappNumber = config.whatsappNumber;
    const whatsappLink = `https://wa.me/${whatsappNumber}`;

    function buildPageGlobals() {
        document.title = `${config.storeName} | Cardápio`;
        const root = document.documentElement;
        root.style.setProperty('--cor-primaria', config.primaryColor);
        root.style.setProperty('--cor-secundaria', config.secondaryColor);
        document.getElementById('whatsapp-number').value = whatsappNumber;
    }

    function buildNavbar() {
        document.getElementById('logo').textContent = config.storeName;

        const promoLink = products.some(p => p.is_on_promotion) 
            ? '<a href="#promotions">Promoções</a>' : '';

        document.getElementById('navbar-items').innerHTML = `
            ${promoLink}
            <a href="#menu">Cardápio</a>
            <a href="#service">Atendimento</a>
        `;
        
        document.getElementById('navbar-cta').innerHTML = `
            <a href="#" class="cart-btn" id="cart-btn-desktop">
                <span class="iconify-inline" data-icon="mdi:cart-variant"></span>
                <span class="cart-count" id="cart-count-desktop">0</span>
            </a>
            <a href="${whatsappLink}" target="_blank" class="btn-cta">
                <span class="iconify-inline" data-icon="akar-icons:whatsapp-fill"></span>
                Fazer Pedido
            </a>
        `;
    }
 
    function buildMobileDrawer() {
        const promoLink = products.some(p => p.is_on_promotion) 
            ? '<a href="#promotions">Promoções</a>' : '';

        document.getElementById('mobile-drawer').innerHTML = `
            <div class="drawer-header">
                <h4>Menu</h4>
                <div class="closeBtn">
                    <span class="iconify-inline" data-icon="mdi:close"></span>
                </div>
            </div>
            <a href="#" class="cart-btn" id="cart-btn-mobile">
                <span class="iconify-inline" data-icon="mdi:cart-variant"></span>
                Meu Carrinho (<span class="cart-count" id="cart-count-mobile">0</span>)
            </a>
            ${promoLink}
            <a href="#menu">Cardápio</a>
            <a href="#service">Atendimento</a>
            <a href="${whatsappLink}" target="_blank" class="whatsapp-btn">
                <span class="iconify-inline" data-icon="akar-icons:whatsapp-fill"></span>
                Fazer Pedido
            </a>
        `;
    }

    function buildBanner() {
        const hasPromo = products.some(p => p.is_on_promotion);
        document.getElementById('banner-container').innerHTML = `
            <div class="bannerContent">
                <div>
                    <h1>${config.storeName}</h1>
                    <p id="subtitle">O melhor cardápio da região, direto na sua casa. Clique no botão abaixo e veja nossas opções!</p>
                    <a href="${hasPromo ? '#promotions' : '#menu'}" class="btn">
                        ${hasPromo ? 'Ver Promoções' : 'Ver Cardápio'}
                    </a>
                </div>
                <img src="${config.bannerImage}" alt="${config.storeName}">
            </div>
        `;
    }

    function buildPromotions() {
        const promoProducts = products.filter(p => p.is_on_promotion);
        const promoContainer = document.getElementById('promotions');
        const promoCardsContainer = document.getElementById('showPromotions');
        
        if (promoProducts.length === 0) {
            promoContainer.style.display = 'none';
            return;
        }

        promoContainer.style.display = 'block';
        promoCardsContainer.innerHTML = '';

        promoProducts.forEach(product => {
            const finalPrice = product.promotion_price ?? 0;
            promoCardsContainer.innerHTML += `
                <div class="cardMenu promo-card">
                    <div class="card-image">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="card-info">
                        <h4>${product.name}</h4>
                        <p>${product.description}</p>
                        <div class="price-container">
                            <span class="old-price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                            <span class="promo-price">R$ ${finalPrice.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button class="add-to-cart-btn" 
                                data-id="${product.id}" 
                                data-name="${product.name}" 
                                data-price="${finalPrice}">
                            Adicionar
                        </button>
                    </div>
                </div>
            `;
        });
    }

    function buildMenu() {
        const normalProducts = products.filter(p => !p.is_on_promotion);
        const filterContainer = document.getElementById('menu-filters');
        const menuContainer = document.getElementById('showMenu');

        filterContainer.innerHTML = '<button class="linkMenu active" data-filter="all">Tudo</button>';
        menuContainer.innerHTML = '';

        if (normalProducts.length === 0) {
            menuContainer.innerHTML = '<p>Nenhum produto cadastrado no momento.</p>';
        }
       
        const menu = {};
        normalProducts.forEach(product => {
            const category = categories.find(c => c.id === product.category_id);
            if (!category) return;

            if (!menu[category.name]) {
                menu[category.name] = {
                    id: category.id,
                    products: []
                };
            }
            menu[category.name].products.push(product);
        });

        for (const categoryName in menu) {
            const category = menu[categoryName];
            const categorySlug = `cat-${category.id}`;
            filterContainer.innerHTML += `
                <button class="linkMenu" data-filter="${categorySlug}">
                    ${categoryName}
                </button>
            `;
        }
        
        for (const categoryName in menu) {
            const category = menu[categoryName];
            const categorySlug = `cat-${category.id}`;
            category.products.forEach(product => {
                menuContainer.innerHTML += `
                    <div class="cardMenu" data-category="${categorySlug}">
                        <div class="card-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="card-info">
                            <h4>${product.name}</h4>
                            <p>${product.description}</p>
                            <span class="price">R$ ${product.price.toFixed(2).replace('.', ',')}</span>
                            <button class="add-to-cart-btn"
                                    data-id="${product.id}" 
                                    data-name="${product.name}" 
                                    data-price="${product.price}">
                                Adicionar
                            </button>
                        </div>
                    </div>
                `;
            });
        }
    }
    
    function buildService() {
        document.getElementById('service-info').innerHTML = `
            <div class="cardLAC">
                <div class="circle">
                    <span class="iconify-inline" data-icon="akar-icons:location"></span>
                </div>
                <p>${config.address}</p>
            </div>
            <div class="cardLAC">
                <div class="circle">
                    <span class="iconify-inline" data-icon="akar-icons:phone"></span>
                </div>
                <p>Telefone de contato e Whatsapp<br>
                   <span>${config.whatsappNumber}</span>
                </p>
            </div>
        `;

        document.getElementById('service-hours').innerHTML = `
            <div class="cardDays"><h5>Seg</h5><p>${config.hours.seg}</p></div>
            <div class="cardDays"><h5>Ter</h5><p>${config.hours.ter}</p></div>
            <div class="cardDays"><h5>Qua</h5><p>${config.hours.qua}</p></div>
            <div class="cardDays"><h5>Qui</h5><p>${config.hours.qui}</p></div>
            <div class="cardDays"><h5>Sex</h5><p>${config.hours.sex}</p></div>
            <div class="cardDays"><h5>Sáb</h5><p>${config.hours.sab}</p></div>
            <div class="cardDays"><h5>Dom</h5><p>${config.hours.dom}</p></div>
        `;
    }
    
    function buildFooter() {
        document.getElementById('footer-content').innerHTML = `
            <div class="content">
                <p>${config.storeName} - ${new Date().getFullYear()} &copy; Todos os direitos reservados.</p>
            </div>
        `;
    }

    const cart = [];
    const cartModal = document.getElementById('cart-modal');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBody = document.getElementById('cart-body');
    const cartTotal = document.getElementById('cart-total');
    
    function initCartLogic() {
        
        const allAddToCartButtons = document.querySelectorAll('.add-to-cart-btn');
        const cartBtnDesktop = document.getElementById('cart-btn-desktop');
        const cartBtnMobile = document.getElementById('cart-btn-mobile');
        const cartCloseBtn = document.getElementById('cart-close-btn');
        const sendOrderBtn = document.getElementById('send-order-btn');
       
        const openCartModal = () => {
            cartModal.classList.add('active');
            cartOverlay.classList.add('active');
            updateCartModal();
        };
        
        const closeCartModal = () => {
            cartModal.classList.remove('active');
            cartOverlay.classList.remove('active');
        };
        
        const addToCart = (event) => {
            const button = event.target;
            const id = button.dataset.id;
            const name = button.dataset.name;
            const price = parseFloat(button.dataset.price);

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id, name, price, quantity: 1 });
            }

            Toastify({
                text: `"${name}" adicionado ao carrinho!`,
                duration: 3000, gravity: "bottom", position: "right",
                backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)",
            }).showToast();

            updateCartModal();
            updateCartCount();
        };

        const updateCartModal = () => {
            cartBody.innerHTML = '';
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
        };

        const updateCartCount = () => {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cart-count-desktop').textContent = totalItems;
            document.getElementById('cart-count-mobile').textContent = totalItems;
        };

        const handleQuantityChange = (event) => {
            const target = event.target;
            if (!target.classList.contains('control-btn')) return;
            const index = target.dataset.index;
            const action = target.dataset.action;
            const item = cart[index];
            if (action === 'increase') {
                item.quantity++;
            } else if (action === 'decrease') {
                item.quantity--;
                if (item.quantity <= 0) cart.splice(index, 1);
            }
            updateCartModal();
            updateCartCount();
        };
        
        const handleRemoveItem = (event) => {
            const target = event.target;
            if (!target.classList.contains('control-btn-remove')) return;
            const index = target.dataset.index;
            cart.splice(index, 1);
            updateCartModal();
            updateCartCount();
        };

      const sendToWhatsApp = () => {
    if (cart.length === 0) return alert("Seu carrinho está vazio!");

    let message = "#PEDIDO_SITE\n"; 
    message += "-----------------------------------\n";
    
    let total = 0;
    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} | ${item.price.toFixed(2)}\n`;
        total += item.price * item.quantity;
    });

    message += "-----------------------------------\n";
    message += `TOTAL: ${total.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(url, '_blank');
};

        cartBtnDesktop.addEventListener('click', openCartModal);
        cartBtnMobile.addEventListener('click', openCartModal);
        cartCloseBtn.addEventListener('click', closeCartModal);
        cartOverlay.addEventListener('click', closeCartModal);
        allAddToCartButtons.forEach(button => button.addEventListener('click', addToCart));
        cartBody.addEventListener('click', handleQuantityChange);
        cartBody.addEventListener('click', handleRemoveItem);
        sendOrderBtn.addEventListener('click', sendToWhatsApp);
    }

    function initNavbarLogic() {
        const btnMobile = document.querySelector('.btnMobile');
        const overlay = document.querySelector('.overlay');
        const drawer = document.querySelector('.mobile-drawer');
        const closeBtn = document.querySelector('.closeBtn');

        const openMenu = () => {
            drawer.classList.add('active');
            overlay.classList.add('active');
        };
        const closeMenu = () => {
            drawer.classList.remove('active');
            overlay.classList.remove('active');
        };
        btnMobile.addEventListener('click', openMenu);
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu); 
    }

    function initFilterLogic() {
        const filterButtons = document.querySelectorAll('.linksMenu .linkMenu');
        const productCards = document.querySelectorAll('#showMenu .cardMenu');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.getAttribute('data-filter');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                productCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filter === 'all' || filter === cardCategory) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    
    buildPageGlobals();
    buildNavbar();
    buildMobileDrawer();
    buildBanner();
    buildPromotions();
    buildMenu();
    buildService();
    buildFooter();
    initCartLogic();
    initNavbarLogic();
    initFilterLogic();
    
});