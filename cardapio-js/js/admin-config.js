const showSaveMessage = (message, isError = false) => {
    const msgDiv = document.getElementById('save-message');
    msgDiv.textContent = message;
    msgDiv.className = isError ? 'error' : 'success';
    setTimeout(() => { msgDiv.textContent = ''; msgDiv.className = ''; }, 3000);
};

async function loadConfig() {
    try {
        const response = await fetch('http://localhost:3001/api/store-config', {
            credentials: 'include'
        });
        if (!response.ok) throw new Error('Falha ao carregar dados. (Você está logado?)');

        const result = await response.json();
        if (!result.success) throw new Error(result.error);

        const config = result.data;

        document.getElementById('nomeLoja').value = config.nomeLoja;
        document.getElementById('whatsappNumero').value = config.whatsappNumero;
        document.getElementById('whatsappLink').value = config.whatsappLink;
        document.getElementById('sobreTitulo').value = config.sobreTitulo;
        document.getElementById('sobreTexto').value = config.sobreTexto;
        document.getElementById('rodapeQuemSomos').value = config.rodapeQuemSomos;
        document.getElementById('enderecoTexto').value = config.enderecoTexto;
        document.getElementById('mapaLink').value = config.mapaLink;
        document.getElementById('social_facebook').value = config.social_facebook;
        document.getElementById('social_instagram').value = config.social_instagram;
        document.getElementById('social_twitter').value = config.social_twitter;

        // Horários
        document.getElementById('horario_dom').value = config.horario_dom;
        document.getElementById('horario_seg').value = config.horario_seg;
        document.getElementById('horario_ter').value = config.horario_ter;
        document.getElementById('horario_qua').value = config.horario_qua;
        document.getElementById('horario_qui').value = config.horario_qui;
        document.getElementById('horario_sex').value = config.horario_sex;
        document.getElementById('horario_sab').value = config.horario_sab;

    } catch (error) {
        console.error('Erro ao carregar configurações:', error);
        showSaveMessage(error.message, true);
    }
}

async function saveConfig(event) {
    event.preventDefault();
    const button = event.target.querySelector('.btn-save');
    button.disabled = true;
    button.textContent = 'Salvando...';

    try {
        // Coleta todos os dados do formulário em um objeto
        const configData = {
            nomeLoja: document.getElementById('nomeLoja').value,
            whatsappNumero: document.getElementById('whatsappNumero').value,
            whatsappLink: document.getElementById('whatsappLink').value,
            sobreTitulo: document.getElementById('sobreTitulo').value,
            sobreTexto: document.getElementById('sobreTexto').value,
            rodapeQuemSomos: document.getElementById('rodapeQuemSomos').value,
            enderecoTexto: document.getElementById('enderecoTexto').value,
            mapaLink: document.getElementById('mapaLink').value,
            social: {
                facebook: document.getElementById('social_facebook').value,
                instagram: document.getElementById('social_instagram').value,
                twitter: document.getElementById('social_twitter').value,
            },
            horarios: {
                dom: document.getElementById('horario_dom').value,
                seg: document.getElementById('horario_seg').value,
                ter: document.getElementById('horario_ter').value,
                qua: document.getElementById('horario_qua').value,
                qui: document.getElementById('horario_qui').value,
                sex: document.getElementById('horario_sex').value,
                sab: document.getElementById('horario_sab').value,
            }
        };

        // Envia para a API
        const response = await fetch('http://localhost:3001/api/store-config', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(configData)
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error);

        showSaveMessage(result.message, false);

    } catch (error) {
        console.error('Erro ao salvar configurações:', error);
        showSaveMessage(error.message, true);
    }

    button.disabled = false;
    button.textContent = 'Salvar Configurações';
}

document.addEventListener('DOMContentLoaded', () => {
    loadConfig(); // Carrega os dados no formulário

    const configForm = document.getElementById('configForm');
    configForm.addEventListener('submit', saveConfig); // Adiciona o evento de salvar
});

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
                window.location.href = '/login.html';
            } else {
                alert('Erro ao fazer logout.');
            }
        } catch (error) {
            alert('Erro de conexão ao tentar sair.');
        }
    });
}