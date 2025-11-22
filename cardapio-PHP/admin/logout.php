<?php
// /cardapio-php/admin/logout.php

// Inicia a sessão (necessário para destruí-la)
session_start();

// 1. Limpa todas as variáveis da sessão
$_SESSION = array();

// 2. Destrói a sessão
session_destroy();

// 3. Redireciona para a página de login
header("Location: login.php");
exit;
?>