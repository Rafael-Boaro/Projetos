// /js/menu-filter.js

document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.linksMenu .linkMenu');
    const productCards = document.querySelectorAll('.cardsMenu .cardMenu');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Pega o filtro do botão (ex: 'all' ou 'lanches')
            const filter = button.getAttribute('data-filter');

            // 1. Atualiza o botão ativo
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Filtra os cards
            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filter === 'all' || filter === cardCategory) {
                    card.style.display = 'flex'; // Mostra o card
                } else {
                    card.style.display = 'none'; // Esconde o card
                }
            });
        });
    });
});