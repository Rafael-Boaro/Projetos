// js/navbar.js

// --- PARTE 1: MENU HAMBÚRGUER (MOBILE) ---

const btnMobile = document.querySelector('.btnMobile');
const navMobile = document.querySelector('.itemsMobile');

// Função que abre/fecha o menu mobile
const toggleBtn = () => {
    if (navMobile.style.transform === 'translateX(0%)')
        navMobile.style.transform = 'translateX(100%)'; // Fecha
    else
        navMobile.style.transform = 'translateX(0%)'; // Abre
};

// Adiciona o evento de clique ao botão hambúrguer
btnMobile.addEventListener('click', toggleBtn);

// --- PARTE 2: BOTÃO "ADMIN" DINÂMICO ---

// Roda quando o HTML da página (index.html) terminar de carregar
window.addEventListener('DOMContentLoaded', async () => {
    try {
        // Chama a nova rota de verificação de sessão no back-end
        const response = await fetch('http://localhost:3001/api/check-session', {
            credentials: 'include' // Envia o cookie de sessão para ver se estamos logados
        });
        
        const session = await response.json(); // Pega a resposta (ex: { loggedIn: true, user: {...} })

        if (session.loggedIn) {
            // Se o usuário ESTÁ LOGADO...
            
            // 1. Encontra a div de ícones (onde está o carrinho)
            const iconsDiv = document.querySelector('.navbar .content .icons');
            
            // 2. Decide para onde o botão Admin deve levar, baseado no cargo
            // Esta é a lógica de 'role' (cargo)
            const adminPage = (session.user.role === 'superadmin') 
                            ? '/superadmin.html' // Se for superadmin
                            : '/admin.html';     // Se for 'store' (admin da loja)

            // 3. Cria o novo elemento <a> (o botão de Admin)
            const adminButton = document.createElement('a');
            adminButton.href = adminPage; // Define o link correto
            adminButton.title = "Painel Admin";
            // Adiciona o ícone de "escudo"
            adminButton.innerHTML = `<span class="iconify-inline" data-icon="mdi:shield-account"></span>`; 

            // 4. Adiciona o botão na navbar
            // .prepend() coloca ele ANTES do carrinho
            iconsDiv.prepend(adminButton); 
        }
        // Se 'session.loggedIn' for 'false', não faz nada, e o botão não aparece.

    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        // Se a API falhar, apenas não mostra o botão
    }
});