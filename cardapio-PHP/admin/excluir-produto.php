<?php
// /cardapio-php/admin/excluir-produto.php

// 1. Inclui o Porteiro!
require_once 'auth_check.php';

// 2. Pega o ID do usuário logado e o ID do produto da URL
$logged_user_id = $_SESSION['user_id'];
$product_id = $_GET['id'];

// Validação simples do ID
if (empty($product_id)) {
    header("Location: gerenciar-produtos.php");
    exit;
}

try {
    // 3. ANTES DE APAGAR: Busca o produto para saber o caminho da imagem
    //    Verificação de segurança: SÓ busca se o ID e o User_ID baterem.
    $stmt = $pdo->prepare("SELECT image_path FROM products WHERE id = ? AND user_id = ?");
    $stmt->execute([$product_id, $logged_user_id]);
    $product = $stmt->fetch(PDO::FETCH_OBJ);

    // Se encontrou o produto (e ele pertence ao usuário)...
    if ($product) {
        
        // 4. APAGA O REGISTRO do banco de dados
        $delete_stmt = $pdo->prepare("DELETE FROM products WHERE id = ? AND user_id = ?");
        $delete_stmt->execute([$product_id, $logged_user_id]);

        // 5. APAGA A IMAGEM do servidor (se ela existir)
        if (!empty($product->image_path)) {
            $full_image_path = '../' . $product->image_path; // Ex: ../uploads/arquivo.jpg
            
            if (file_exists($full_image_path)) {
                unlink($full_image_path);
            }
        }
    }
    
    // 6. Sucesso! Redireciona de volta para a lista
    //    (Mesmo se 'product' não for encontrado, apenas redirecionamos)
    header("Location: gerenciar-produtos.php");
    exit;

} catch (PDOException $e) {
    // 7. Erro de SQL
    die("Erro de banco de dados: " . $e->getMessage());
    // (Num sistema real, redirecionaríamos com uma msg de erro)
    // header("Location: gerenciar-produtos.php?error=db_error");
}
?>