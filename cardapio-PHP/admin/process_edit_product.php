<?php
// /cardapio-php/admin/process_edit_product.php (ATUALIZADO)

require_once 'auth_check.php';

define('UPLOAD_DIR', '../uploads/');

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Pega dados normais
    $logged_user_id = $_SESSION['user_id'];
    $product_id = $_POST['product_id'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    $old_image_path = $_POST['old_image_path'];
    
    // --- MUDANÇA AQUI ---
    $category_id = $_POST['category_id'];
    // --- FIM DA MUDANÇA ---

    // Pega dados da promoção
    $is_on_promotion = isset($_POST['is_on_promotion']) ? 1 : 0;
    $promotion_price = !empty($_POST['promotion_price']) ? $_POST['promotion_price'] : null;

    if ($is_on_promotion == 0) {
        $promotion_price = null;
    }

    // --- MUDANÇA AQUI ---
    // Validação agora checa 'category_id'
    if (empty($product_id) || empty($name) || empty($price) || empty($category_id)) {
        header("Location: editar-produto.php?id=$product_id&error=Campos obrigatórios faltando.");
        exit;
    }

    $new_image_path = $old_image_path;
    $file_uploaded = false;

    // Lógica de Upload (sem alterações)
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        // ... (código de upload)
        $file = $_FILES['image'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];
        if (in_array($fileExt, $allowed)) {
            if ($fileError === 0) {
                if ($fileSize < 5000000) {
                    $fileNameNew = uniqid('', true) . "." . $fileExt;
                    $fileDestination = UPLOAD_DIR . $fileNameNew;
                    if (move_uploaded_file($fileTmpName, $fileDestination)) {
                        $new_image_path = 'uploads/' . $fileNameNew;
                        $file_uploaded = true;
                    } else {
                        header("Location: editar-a.php?id=$product_id&error=Falha ao mover o arquivo."); exit;
                    }
                } else {
                    header("Location: editar-a.php?id=$product_id&error=Arquivo muito grande (max 5MB)."); exit;
                }
            } else {
                header("Location: editar-a.php?id=$product_id&error=Erro no upload do arquivo."); exit;
            }
        } else {
            header("Location: editar-a.php?id=$product_id&error=Tipo de arquivo não permitido."); exit;
        }
    }

    // --- MUDANÇA AQUI ---
    // ATUALIZA o Banco com 'category_id'
    try {
        $stmt = $pdo->prepare(
            "UPDATE products SET 
                name = ?, description = ?, price = ?, image_path = ?,
                is_on_promotion = ?, promotion_price = ?,
                category_id = ? 
             WHERE id = ? AND user_id = ?"
        );
        
        $stmt->execute([
            $name, 
            $description, 
            $price, 
            $new_image_path,
            $is_on_promotion,
            $promotion_price,
            $category_id, // <-- MUDANÇA
            $product_id,
            $logged_user_id
        ]);

        // Apaga o arquivo antigo (sem alterações)
        if ($file_uploaded && !empty($old_image_path) && $old_image_path != $new_image_path) {
            // ... (código para apagar)
        }
        
        header("Location: gerenciar-produtos.php");
        exit;

    } catch (PDOException $e) {
        header("Location: editar-produto.php?id=$product_id&error=Erro de banco de dados: " . $e->getMessage());
        exit;
    }
} else {
    header("Location: dashboard.php");
    exit;
}
?>