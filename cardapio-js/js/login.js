// js/login.js

// --- 1. Seleção dos Elementos do DOM ---
// Pega o formulário de login e o <div%gt; onde as mensagens de erro serão mostradas
const loginForm = document.getElementById('loginForm');
const errorMessageDiv = document.getElementById('error-message');

// --- 2. Event Listener Principal (ao Enviar o Formulário) ---
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede que a página recarregue ao enviar o formulário

    // --- 3. Coleta dos Dados ---
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    errorMessageDiv.textContent = ''; // Limpa mensagens de erro antigas

    // --- 4. Bloco try...catch para a Requisição ---
    try {
        // Envia os dados para a API de login no back-end
        const response = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }), // Envia usuário e senha como JSON
            credentials: 'include' // IMPORTANTE: Envia o cookie de sessão, se houver
        });

        // --- 5. Processamento da Resposta ---
        const result = await response.json(); // Converte a resposta do servidor em objeto JS

        if (result.success) {
            // --- 6. Lógica de Redirecionamento (Baseado no Cargo) ---
            // O back-end nos disse quem é o usuário (o "role")
            if (result.role === 'superadmin') {
                // Se for Super Admin, redireciona para a página de super admin
                window.location.href = '/superadmin.html'; 
            } else {
                // Se for 'store' (admin da loja), redireciona para o painel da cozinha
                window.location.href = '/admin.html';
            }
        } else {
            // Se o login falhar (result.success == false), mostra a mensagem de erro vinda do back-end
            errorMessageDiv.textContent = result.message || 'Usuário ou senha inválidos.';
        }

    } catch (error) {
        // --- 7. Tratamento de Erro (Falha de Conexão) ---
        console.error('Erro ao tentar fazer login:', error);
        errorMessageDiv.textContent = 'Erro de conexão com o servidor.';
    }
});