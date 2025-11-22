// /js/navbar.js (CÓDIGO NOVO)

document.addEventListener('DOMContentLoaded', () => {
    
    // Seleciona os 4 elementos que precisamos
    const btnMobile = document.querySelector('.btnMobile');
    const overlay = document.querySelector('.overlay');
    const drawer = document.querySelector('.mobile-drawer');
    const closeBtn = document.querySelector('.closeBtn');

    // Função para ABRIR o menu
    const openMenu = () => {
        drawer.classList.add('active');
        overlay.classList.add('active');
    };

    // Função para FECHAR o menu
    const closeMenu = () => {
        drawer.classList.remove('active');
        overlay.classList.remove('active');
    };

    // Eventos de clique
    btnMobile.addEventListener('click', openMenu); // Clicar no hamburguer -> abre
    closeBtn.addEventListener('click', closeMenu);  // Clicar no X -> fecha
    overlay.addEventListener('click', closeMenu);   // Clicar no fundo escuro -> fecha
});