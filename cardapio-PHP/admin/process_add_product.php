<?php
// /cardapio-php/admin/process_add_product.php (ATUALIZADO)

require_once 'auth_check.php';

define('UPLOAD_DIR', '../uploads/');
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Pega dados normais
    $user_id = $_SESSION['user_id'];
    $name = $_POST['name'];
    $description = $_POST['description'];
    $price = $_POST['price'];
    
    // --- MUDANÇA AQUI ---
    // Pega o ID da categoria do <select>
    $category_id = $_POST['category_id'];
    // --- FIM DA MUDANÇA ---

    // Pega dados da promoção
    $is_on_promotion = isset($_POST['is_on_promotion']) ? 1 : 0;
    $promotion_price = !empty($_POST['promotion_price']) ? $_POST['promotion_price'] : null;

    if ($is_on_promotion == 0) {
        $promotion_price = null;
    }

    $image_path = null;
    // --- MUDANÇA AQUI ---
    // Validação agora checa 'category_id'
    if (empty($name) || empty($price) || empty($category_id)) {
        header("Location: adicionar-produto.php?error=Nome, preço e categoria são obrigatórios.");
        exit;
    }
    // --- FIM DA MUDANÇA ---

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
                        $image_path = 'uploads/' . $fileNameNew;
                    } else {
                        header("Location: adicionar-produto.php?error=Falha ao mover o arquivo."); exit;
                    }
                } else {
                    header("Location: adicionar-produto.php?error=Arquivo muito grande (max 5MB)."); exit;
                }
            } else {
                header("Location: adicionar-produto.php?error=Erro no upload do arquivo."); exit;
            }
        } else {
            header("Location: adicionar-produto.php?error=Tipo de arquivo não permitido."); exit;
        }
    }

    // --- MUDANÇA AQUI ---
    // Insere no Banco com 'category_id'
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO products (user_id, name, description, price, image_path, is_on_promotion, promotion_price, category_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        
        $stmt->execute([
            $user_id, 
            $name, 
            $description, 
            $price, 
            $image_path,
            $is_on_promotion,
            $promotion_price,
            $category_id // <-- MUDANÇA
        ]);
        
        header("Location: gerenciar-produtos.php");
        exit;

    } catch (PDOException $e) {
        header("Location: adicionar-produto.php?error=Erro de banco de dados: " . $e->getMessage());
        exit;
    }
} else {
    header("Location: dashboard.php");
    exit;
}
?>