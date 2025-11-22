// script.js (VERSÃO 2.0 - COM ANIMAÇÃO)

// --- 1. CÓDIGO DO CARROSSEL ---
const swiper = new Swiper('.swiper', {
    loop: true,
    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

// --- 2. CÓDIGO DO "ENFEITE" (ANIMAÇÃO DE SCROLL) ---
const observer = new IntersectionObserver((entries) => {
    // Loop por todas as "entradas" (elementos que estamos observando)
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Se o elemento ESTÁ visível, adiciona a classe
            entry.target.classList.add('is-visible');
        }
        // Opcional: Se quiser que a animação rode toda vez que rolar para cima e para baixo:
        // else {
        //     entry.target.classList.remove('is-visible');
        // }
    });
}, {
    threshold: 0.1 // Dispara quando 10% do elemento está visível
});

// Pega todos os elementos que marcamos com a classe .animate-on-scroll
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');

// Manda o "observador" observar cada um deles
elementsToAnimate.forEach((el) => observer.observe(el));