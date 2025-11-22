<?php
// /cardapio-php/admin/dashboard.php

// 1. Inclui o Porteiro!
// Este é o passo mais importante.
require_once 'auth_check.php';

// Se o script chegou até aqui, o usuário está logado.
// Pegamos o nome dele da sessão (que foi salvo no process_login.php)
$admin_username = $_SESSION['username'];
$admin_username = $_SESSION['username'];
$admin_role = $_SESSION['role']; // <-- ADICIONE ESTA LINHA
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard do Admin</title>
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
        <h1>Bem-vindo, <?php echo htmlspecialchars($admin_username); ?>!</h1>
        <p>Este é o seu painel de controle. Escolha uma das opções abaixo para começar.</p>

       <div class="dashboard-menu">
    <a href="gerenciar-produtos.php" class="menu-card">
        <h2><i class="fa-solid fa-burger"></i> Gerenciar Produtos</h2>
        <p>Adicionar, editar e excluir os produtos do cardápio.</p>
    </a>
    
    <a href="config-site.php" class="menu-card">
        <h2><i class="fa-solid fa-store"></i> Configurar Site</h2>
        <p>Alterar nome da loja, horários, endereço e cores do site.</p>
    </a>

    <?php if ($admin_role === 'superadmin'): ?>
        <a href="cadastrar-usuario.php" class="menu-card">
            <h2><i class="fa-solid fa-user-plus"></i> Cadastrar Usuários</h2>
            <p>Adicionar novas contas de admin (lojas) ao sistema.</p>
        </a>
    <?php endif; ?>
</div>
    </div>

</body>
</html>