<?php
// /cardapio-php/admin/process_cadastro.php

// 1. Inclui o Porteiro Super Admin (só super admin pode cadastrar)
require_once 'auth_check_superadmin.php';

// 2. Verifica se os dados vieram via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Validação simples
    if (empty($username) || empty($password)) {
        header("Location: cadastrar-usuario.php?error=Usuário e senha são obrigatórios");
        exit;
    }

    try {
        // 3. CRIPTOGRAFA a nova senha (usando o método do PHP)
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        
        // 4. Insere o novo usuário no banco
        // O cargo 'store' é definido automaticamente pelo DEFAULT do banco
        $stmt = $pdo->prepare("INSERT INTO users (username, password_hash) VALUES (?, ?)");
        $stmt->execute([$username, $passwordHash]);
        
        // 5. Sucesso! Redireciona de volta
        header("Location: cadastrar-usuario.php?success=1");
        exit;

    } catch (PDOException $e) {
        // 6. Erro de SQL! (Provavelmente usuário duplicado)
        if ($e->getCode() == 23000) { // Código de erro para "Duplicate entry"
            header("Location: cadastrar-usuario.php?error=Este nome de usuário já existe.");
        } else {
            header("Location: cadastrar-usuario.php?error=Erro de banco de dados.");
        }
        exit;
    }
} else {
    // Se acessar direto, chuta para o dashboard
    header("Location: dashboard.php");
    exit;
}
?>