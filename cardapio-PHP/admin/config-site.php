<?php
// /cardapio-php/admin/config-site.php (ATUALIZADO)

// 1. Inclui o Porteiro!
require_once 'auth_check.php';

// 2. Pega o ID do usuário logado
$logged_user_id = $_SESSION['user_id'];
$config = null;

try {
    // 3. Tenta BUSCAR a configuração deste usuário
    $stmt = $pdo->prepare("SELECT * FROM store_config WHERE user_id = ?");
    $stmt->execute([$logged_user_id]);
    $config = $stmt->fetch(PDO::FETCH_OBJ);

    // 4. Se NÃO ENCONTROU (Get-or-Create)
    if (!$config) {
        // Cria uma configuração padrão para este novo usuário
        // (Note que banner_image_path usará o DEFAULT 'uploads/default.png' do SQL)
        $stmt = $pdo->prepare(
            "INSERT INTO store_config (user_id, nomeLoja, whatsappNumero, enderecoTexto, horario_seg, horario_ter, horario_qua, horario_qui, horario_sex, horario_sab, horario_dom, cor_primaria, cor_secundaria) 
             VALUES (?, 'Nome da Loja', '(00) 00000-0000', 'Seu Endereço Aqui', 'Fechado', '18h às 23h', '18h às 23h', '18h às 23h', '18h às 00h', '18h às 00h', 'Fechado', '#A90E0E', '#FF7F0A')"
        );
        $stmt->execute([$logged_user_id]);
        
        // Busca novamente a configuração que acabamos de criar
        $stmt = $pdo->prepare("SELECT * FROM store_config WHERE user_id = ?");
        $stmt->execute([$logged_user_id]);
        $config = $stmt->fetch(PDO::FETCH_OBJ);
    }

} catch (PDOException $e) {
    die("Erro ao carregar configurações: ". $e->getMessage());
}

if (!$config) {
    die("Não foi possível carregar ou criar as configurações.");
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configurações do Site</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body class="dashboard">

    <nav class="admin-navbar">
        <a href="dashboard.php" class="logo">Painel Admin</a>
        <div class="nav-links">
            <a href="../index.php" target="_blank">Ver Site</a>
            <a href="logout.php" class="logout-btn">Sair</a>
        </div>
    </nav>

    <div class="admin-container">
        <a href="dashboard.php" class="back-link"><i class="fa-solid fa-arrow-left"></i> Voltar ao Dashboard</a>
        <h1>Configurações do Site</h1>
        <p>Altere aqui as informações públicas e a aparência do seu cardápio.</p>

        <?php if(isset($_GET['success'])): ?>
            <div class="message-feedback" style="background-color: #d4edda; color: #155724; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                Configurações salvas com sucesso!
            </div>
        <?php endif; ?>

        <form action="process_config_site.php" method="POST" enctype="multipart/form-data" class="config-form">
            
            <input type="hidden" name="old_banner_image" value="<?php echo htmlspecialchars($config->banner_image_path); ?>">

            <h2>Informações da Loja</h2>
            <div class="input-group">
                <label for="nomeLoja">Nome da Loja:</label>
                <input type="text" id="nomeLoja" name="nomeLoja" value="<?php echo htmlspecialchars($config->nomeLoja); ?>" required>
            </div>
            <div class="input-group">
                <label for="whatsappNumero">Nº de WhatsApp (para pedidos):</label>
                <input type="text" id="whatsappNumero" name="whatsappNumero" value="<?php echo htmlspecialchars($config->whatsappNumero); ?>" required>
            </div>
            <div class="input-group">
                <label for="enderecoTexto">Endereço (Texto):</label>
                <input type="text" id="enderecoTexto" name="enderecoTexto" value="<?php echo htmlspecialchars($config->enderecoTexto); ?>">
            </div>

            <h2>Horários de Funcionamento</h2>
            <div class="horarios-grid">
                <div class="input-group"><label for="horario_seg">Segunda:</label><input type="text" id="horario_seg" name="horario_seg" value="<?php echo htmlspecialchars($config->horario_seg); ?>"></div>
                <div class="input-group"><label for="horario_ter">Terça:</label><input type="text" id="horario_ter" name="horario_ter" value="<?php echo htmlspecialchars($config->horario_ter); ?>"></div>
                <div class="input-group"><label for="horario_qua">Quarta:</label><input type="text" id="horario_qua" name="horario_qua" value="<?php echo htmlspecialchars($config->horario_qua); ?>"></div>
                <div class="input-group"><label for="horario_qui">Quinta:</label><input type="text" id="horario_qui" name="horario_qui" value="<?php echo htmlspecialchars($config->horario_qui); ?>"></div>
                <div class="input-group"><label for="horario_sex">Sexta:</label><input type="text" id="horario_sex" name="horario_sex" value="<?php echo htmlspecialchars($config->horario_sex); ?>"></div>
                <div class="input-group"><label for="horario_sab">Sábado:</label><input type="text" id="horario_sab" name="horario_sab" value="<?php echo htmlspecialchars($config->horario_sab); ?>"></div>
                <div class="input-group"><label for="horario_dom">Domingo:</label><input type="text" id="horario_dom" name="horario_dom" value="<?php echo htmlspecialchars($config->horario_dom); ?>"></div>
            </div>

            <h2>Aparência</h2>

            <div class="input-group">
                <label for="banner_image">Imagem do Banner:</label>
                <p style="margin: 5px 0;">Imagem atual:</p>
                <?php if (!empty($config->banner_image_path)): ?>
                    <img src="../<?php echo htmlspecialchars($config->banner_image_path); ?>" alt="Banner Atual" width="200" style="margin-bottom: 10px; border-radius: 5px; border: 1px solid #ddd;">
                <?php else: ?>
                    <p>(Sem imagem. Usando padrão.)</p>
                <?php endif; ?>
                
                <input type="file" id="banner_image" name="banner_image" accept="image/png, image/jpeg, image/webp">
                <small>Envie um novo arquivo apenas se desejar **substituir** o atual.</small>
            </div>

            <div class="cores-grid">
                <div class="input-group">
                    <label for="cor_primaria">Cor Primária (Ex: Títulos):</label>
                    <input type="color" id="cor_primaria" name="cor_primaria" value="<?php echo htmlspecialchars($config->cor_primaria); ?>">
                </div>
                <div class="input-group">
                    <label for="cor_secundaria">Cor Secundária (Ex: Preços):</label>
                    <input type="color" id="cor_secundaria" name="cor_secundaria" value="<?php echo htmlspecialchars($config->cor_secundaria); ?>">
                </div>
            </div>

            <button type="submit"><i class="fa-solid fa-save"></i> Salvar Configurações</button>
        </form>
    </div>

</body>
</html>