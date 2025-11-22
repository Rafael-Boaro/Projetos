<?php
// /cardapio-php/admin/editar-produto.php (ATUALIZADO com <select>)

require_once 'auth_check.php';

$logged_user_id = $_SESSION['user_id'];
$product_id = $_GET['id'];

if (empty($product_id)) {
    header("Location: gerenciar-produtos.php");
    exit;
}

try {
    // 1. Busca o produto
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND user_id = ?");
    $stmt->execute([$product_id, $logged_user_id]);
    $product = $stmt->fetch(PDO::FETCH_OBJ);

    if (!$product) {
        header("Location: gerenciar-produtos.php");
        exit;
    }
    
    // 2. Busca TODAS as categorias para o dropdown
    $stmt_cat = $pdo->prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY name");
    $stmt_cat->execute([$logged_user_id]);
    $categories = $stmt_cat->fetchAll(PDO::FETCH_OBJ);

} catch (PDOException $e) {
    die("Erro ao buscar dados: " . $e->getMessage());
}

// Variáveis de ajuda para a promoção
$is_checked = $product->is_on_promotion;
$promo_price_value = $product->promotion_price ? $product->promotion_price : '';
$promo_group_style = $is_checked ? 'display: block;' : 'display: none;';
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Editar Produto</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body class="dashboard">

    <nav class="admin-navbar">
        </nav>

    <div class="admin-container">
      <a href="gerenciar-produtos.php" class="back-link"><i class="fa-solid fa-arrow-left"></i> Voltar</a>
        <h1>Editar Produto: <?php echo htmlspecialchars($product->name); ?></h1>
        
        <?php if(isset($_GET['error'])): ?>
            <div class="message-feedback" style="background-color: #ffcccc; color: #cc0000;">
                Erro: <?php echo htmlspecialchars($_GET['error']); ?>
            </div>
        <?php endif; ?>

        <form action="process_edit_product.php" method="POST" enctype="multipart/form-data">
            
            <input type="hidden" name="product_id" value="<?php echo $product->id; ?>">
            <input type="hidden" name="old_image_path" value="<?php echo htmlspecialchars($product->image_path ?? ''); ?>">

            <div class="input-group">
                <label for="name">Nome do Produto:</label>
                <input type="text" id="name" name="name" required 
                       value="<?php echo htmlspecialchars($product->name); ?>">
            </div>
            
            <div class="input-group">
                <label for="description">Descrição:</label>
                <textarea id="description" name="description" rows="3"><?php echo htmlspecialchars($product->description); ?></textarea>
            </div>
            
            <div class="input-group">
                <label for="category_id">Categoria:</label>
                <select id="category_id" name="category_id" required>
                    <option value="">Selecione uma categoria</option>
                    <?php foreach ($categories as $category): ?>
                        <option value="<?php echo $category->id; ?>" 
                                <?php echo ($product->category_id == $category->id) ? 'selected' : ''; ?>>
                            <?php echo htmlspecialchars($category->name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>
            <div class="input-group">
                <label for="price">Preço Normal (ex: 12.50):</label>
                <input type="number" step="0.01" id="price" name="price" required 
                       value="<?php echo htmlspecialchars($product->price); ?>">
            </div>
            
            <div class="input-group-checkbox">
                <input type="checkbox" id="is_on_promotion" name="is_on_promotion" value="1" <?php echo $is_checked ? 'checked' : ''; ?>>
                <label for="is_on_promotion">Este produto está em promoção?</label>
            </div>
            <div class="input-group" id="promotion_price_group" style="<?php echo $promo_group_style; ?>">
                <label for="promotion_price">Preço Promocional (ex: 9.90):</label>
                <input type="number" step="0.01" id="promotion_price" name="promotion_price" value="<?php echo htmlspecialchars($promo_price_value); ?>">
            </div>
            
            <div class="input-group">
                <label for="image">Imagem do Produto (Opcional):</label>
                <p>Imagem atual:</p>
                <?php if (!empty($product->image_path)): ?>
                    <img src="../<?php echo htmlspecialchars($product->image_path); ?>" alt="Imagem Atual" width="100" style="margin-bottom: 10px;">
                <?php else: ?>
                    <p>(Sem imagem)</p>
                <?php endif; ?>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/webp">
                <small>Envie um novo arquivo apenas se desejar **substituir** o atual.</small>
            </div>
            
            <button type="submit"><i class="fa-solid fa-save"></i> Salvar Alterações</button>
        </form>
    </div>

    <script>
        // Script do preço (sem alteração)
        document.getElementById('is_on_promotion').addEventListener('change', function() {
            var priceGroup = document.getElementById('promotion_price_group');
            if (this.checked) {
                priceGroup.style.display = 'block';
            } else {
                priceGroup.style.display = 'none';
            }
        });
    </script>
</body>
</html>