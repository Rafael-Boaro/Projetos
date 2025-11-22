<?php
// /cardapio-php/admin/cadastrar-usuario.php

// 1. Inclui o Porteiro! (O NOVO, que só permite Super Admin)
require_once 'auth_check_superadmin.php';

// (Variável $admin_username vem do auth_check.php, que incluiu db.php)
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastrar Usuário</title>
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
        <h1>Cadastrar Novo Usuário (Loja)</h1>
        
        <form action="process_cadastro.php" method="POST" style="max-width: 400px; margin-top: 20px;">
            <div class="input-group">
                <label for="username">Nome do Novo Usuário (ex: loja1):</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="password">Senha para o Novo Usuário:</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <div classclass="message-feedback">
                <?php if(isset($_GET['success'])): ?>
                    <p style="color: green;">Usuário cadastrado com sucesso!</p>
                <?php endif; ?>
                <?php if(isset($_GET['error'])): ?>
                    <p style="color: red;">Erro: <?php echo htmlspecialchars($_GET['error']); ?></p>
                <?php endif; ?>
            </div>
            
            <button type="submit"><i class="fa-solid fa-user-plus"></i> Cadastrar Usuário</button>
        </form>
        
    </div>

</body>
</html>