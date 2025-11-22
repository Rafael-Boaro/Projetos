// js/theme-loader.js (VERSÃO ATUALIZADA - Lendo da API)

/**
 * Esta função agora é assíncrona.
 * Ela busca os dados da API do back-end em vez de um arquivo local.
 */
async function loadStoreConfig() {
    try {
        // 1. CHAMA A NOVA API (do server.js)
        const response = await fetch('http://localhost:3001/api/store-config');
        if (!response.ok) {
            throw new Error('Falha ao carregar configuração da loja.');
        }

        const result = await response.json();
        if (!result.success) {
            throw new Error(result.error);
        }

        const config = result.data; // Os dados agora vêm do banco!

        // --- O RESTO DO CÓDIGO É O MESMO DE ANTES ---

        // --- 1. Preencher a Navbar e Links ---
        document.getElementById('logo').textContent = config.nomeLoja;
        document.getElementById('logo-rodape').textContent = config.nomeLoja;
        document.getElementById('whatsapp-link').href = config.whatsappLink;
        document.getElementById('whatsapp-link-mobile').href = config.whatsappLink;

        // --- 2. Preencher Redes Sociais ---
        document.getElementById('social-facebook').href = config.social_facebook;
        document.getElementById('social-instagram').href = config.social_instagram;
        document.getElementById('social-twitter').href = config.social_twitter;

        // --- 3. Preencher Textos "Sobre" ---
        document.getElementById('sobre-titulo').textContent = config.sobreTitulo;
        document.getElementById('sobre-texto').innerHTML = config.sobreTexto;

        // --- 4. Preencher Atendimento e Mapa ---
        document.getElementById('store-address').innerHTML = config.enderecoTexto;
        document.getElementById('store-phone').textContent = config.whatsappNumero;
        document.getElementById('map-iframe').src = config.mapaLink;

        // --- 5. Preencher Horários ---
        document.getElementById('horario-dom').textContent = config.horario_dom || 'Fechado';
        document.getElementById('horario-seg').textContent = config.horario_seg || 'Fechado';
        document.getElementById('horario-ter').textContent = config.horario_ter || 'Fechado';
        document.getElementById('horario-qua').textContent = config.horario_qua || 'Fechado';
        document.getElementById('horario-qui').textContent = config.horario_qui || 'Fechado';
        document.getElementById('horario-sex').textContent = config.horario_sex || 'Fechado';
        document.getElementById('horario-sab').textContent = config.horario_sab || 'Fechado';

        // --- 6. Preencher Rodapé ---
        document.getElementById('rodape-quem-somos').textContent = config.rodapeQuemSomos;

        // (Bônus) Atualiza o título da página
        document.title = `${config.nomeLoja} | Lanchonete`;

        console.log(`Tema da loja "${config.nomeLoja}" carregado com sucesso (via API).`);

    } catch (error) {
        console.error("Erro ao carregar 'theme-loader.js':", error);
        // Se falhar, podemos deixar os nomes padrão do HTML
    }
}

// Roda a função assim que o HTML é carregado
document.addEventListener('DOMContentLoaded', loadStoreConfig);