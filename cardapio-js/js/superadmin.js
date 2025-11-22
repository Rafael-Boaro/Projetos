// js/superadmin.js

// --- PARTE 1: CADASTRO DE NOVO ADMIN (LOJA) ---
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona os elementos do formulário
    const registerForm = document.getElementById('registerForm');
    const newUsername = document.getElementById('newUsername');
    const newPassword = document.getElementById('newPassword');
    const messageDiv = document.getElementById('register-message');

    // Listener para o envio do formulário
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Impede o recarregamento

        // Pega os valores
        const username = newUsername.value;
        const password = newPassword.value;

        // Limpa mensagens antigas
        messageDiv.textContent = '';
        messageDiv.className = '';

        try {
            // Envia os dados para a API de registro de admin
            const response = await fetch('http://localhost:3001/api/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include' // Envia o cookie de sessão (para provar que somos Super Admin)
            });

            const result = await response.json();

            // Se a resposta não for OK (ex: 409 "Usuário já existe")
            if (!response.ok) {
                throw new Error(result.error || 'Erro desconhecido');
            }

            // Sucesso!
            messageDiv.textContent = result.message; // Mostra "Novo administrador cadastrado..."
            messageDiv.className = 'success';
            registerForm.reset(); // Limpa o formulário

        } catch (error) {
            // Se der erro...
            console.error('Erro ao cadastrar admin:', error);
            messageDiv.textContent = error.message; // Mostra o erro (ex: "Este nome de usuário já está em uso.")
            messageDiv.className = 'error';
        }
    });
});

// --- PARTE 2: LÓGICA DE LOGOUT ---
// (Esta lógica é idêntica à do admin.js)
const logoutButtonSuper = document.getElementById('logoutButton');
if (logoutButtonSuper) {
    logoutButtonSuper.addEventListener('click', async () => {
        if (!confirm('Tem certeza que deseja sair?')) return;

        try {
            // Chama a API de logout
            const response = await fetch('http://localhost:3001/api/logout', {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success) {
                window.location.href = '/login.html'; // Redireciona para o login
            } else {
                alert('Erro ao fazer logout.');
            }
        } catch (error) {
            alert('Erro de conexão ao tentar sair.');
        }
    });
}