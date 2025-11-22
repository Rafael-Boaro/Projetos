<?php
// /cardapio-php/admin/auth_check_superadmin.php

// 1. Inclui o porteiro normal
require_once 'auth_check.php';

// 2. Verifica o Cargo (Role)
// Se o cargo não for 'superadmin', expulsa ele.
if ($_SESSION['role'] !== 'superadmin') {
    
    // Mostra um erro simples e para o script
    die("Acesso negado. Esta página é restrita ao Super Admin.");
    
    // (Num sistema real, redirecionaríamos para o dashboard)
    // header("Location: dashboard.php");
    // exit;
}

// Se o script continuar, o usuário é Super Admin.
?>