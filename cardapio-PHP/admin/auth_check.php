<?php
// /cardapio-php/admin/auth_check.php

// Inclui a conexão (que também inicia a sessão)
require_once '../db.php';

// A VERIFICAÇÃO:
// Se a variável de sessão 'admin_logged_in' não existir OU for 'false',
// o usuário não está logado.
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    
    // Redireciona para o login e para o script
    header("Location: login.php?error=3"); // error=3 pode significar "Você precisa logar"
    exit;
}

// Se o script continuar, significa que o admin está logado.
?>