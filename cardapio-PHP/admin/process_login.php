<?php
// /cardapio-php/admin/process_login.php

// 1. Inclui o banco e inicia a sessão
require_once '../db.php';

// 2. Verifica se os dados vieram via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $username = $_POST['username'];
    $password = $_POST['password'];

    try {
        // 3. Busca o usuário no banco
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        // 4. Verifica o usuário e a senha
        // $user verifica se o usuário foi encontrado
        // password_verify() compara a senha digitada com o hash salvo no banco
        if ($user && password_verify($password, $user->password_hash)) {
            
           // 5. Sucesso! Salva os dados na sessão
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['user_id'] = $user->id;
            $_SESSION['username'] = $user->username;
            $_SESSION['role'] = $user->role;
            
            // Redireciona para o painel principal
            header("Location: dashboard.php");
            exit;
            
        } else {
            // 6. Falha! Redireciona de volta para o login com erro 1
            header("Location: login.php?error=1");
            exit;
        }

    } catch (PDOException $e) {
        // 7. Erro de SQL! Redireciona com erro 2
        header("Location: login.php?error=2");
        exit;
    }
} else {
    // Se alguém tentar acessar este arquivo diretamente, chuta ele para o login
    header("Location: login.php");
    exit;
}
?>