<?php
// /cardapio-php/admin/login.php

// Inclui a conexão com o banco e inicia a sessão
// (O 'db.php' está um nível acima, por isso '..')
require_once '../db.php';

// Se o admin já estiver logado, redireciona ele para o dashboard
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    header("Location: dashboard.php");
    exit;
}

// Verifica se há uma mensagem de erro (vinda do process_login.php)
$error = '';
if (isset($_GET['error'])) {
    if ($_GET['error'] == 1) {
        $error = "Usuário ou senha inválidos!";
    } else {
        $error = "Ocorreu um erro. Tente novamente.";
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login do Admin</title>
    <link rel="stylesheet" href="../css/admin.css">
</head>
<body>
    <div class="login-container">
        <h1>Login do Admin</h1>
        <form action="process_login.php" method="POST">
            <div class="input-group">
                <label for="username">Usuário:</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="input-group">
                <label for="password">Senha:</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit">Entrar</button>
            
            <div class="error-message">
                <?php echo $error; ?>
            </div>
        </form>
    </div>
</body>
</html>