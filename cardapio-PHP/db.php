<?php
// /cardapio-php/db.php

// --- Configurações do Banco de Dados ---
// Altere estas variáveis se o seu MySQL for diferente (ex: XAMPP)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', ''); // Senha do seu MySQL (root do XAMPP geralmente é em branco)
define('DB_NAME', 'cardapio_php'); // O nome do banco que você criou no Passo 1

// --- Conexão ---
try {
    // Usando PDO (PHP Data Objects) - é mais moderno e seguro que o mysqli
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    
    // Configura o PDO para lançar exceções em caso de erro
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Configura para que os resultados venham como objetos (mais fácil de usar)
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);
    
} catch (PDOException $e) {
    // Se a conexão falhar, mata o script e mostra o erro.
    die("ERRO: Não foi possível conectar ao banco de dados. " . $e->getMessage());
}

// Inicia a sessão
// (Precisamos disso em TODAS as páginas para o login funcionar)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
?>