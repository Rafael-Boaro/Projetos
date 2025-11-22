function addLogoutLogic() {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            if (!confirm('Tem certeza que deseja sair?')) return;
            try {
                const response = await fetch('http://localhost:3001/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                const result = await response.json();
                if (result.success) {
                    window.location.href = '/login.html'; //
                } else {
                    alert('Erro ao fazer logout.');
                }
            } catch (error) {
                alert('Erro de conexão ao tentar sair.');
            }
        });
    }
}

async function loadAdminLogo() {
    const logoElement = document.getElementById('admin-logo');
    if (!logoElement) return;

    try {
        const response = await fetch('http://localhost:3001/api/store-config'); //
        if (!response.ok) return;
        
        const result = await response.json();
        if (result.success) {
            logoElement.textContent = result.data.nomeLoja; // Insere o nome
        }
    } catch (error) {
        console.error('Erro ao carregar nome da loja:', error);
        logoElement.textContent = 'Painel Admin'; // Nome de fallback
    }
}

// Roda as lógicas quando o HTML carregar
document.addEventListener('DOMContentLoaded', () => {
    addLogoutLogic();
    loadAdminLogo();
});