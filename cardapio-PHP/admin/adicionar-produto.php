<?php
// /cardapio-php/admin/adicionar-produto.php (ATUALIZADO com <select>)

require_once 'auth_check.php';

// Busca as categorias do usuário para o dropdown
$stmt = $pdo->prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY name");
$stmt->execute([$_SESSION['user_id']]);
$categories = $stmt->fetchAll(PDO::FETCH_OBJ);

?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Adicionar Produto</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body class="dashboard">
    <nav class="admin-navbar">...</nav> <div class="admin-container">
       <a href="gerenciar-produtos.php" class="back-link"><i class="fa-solid fa-arrow-left"></i> Voltar para Produtos</a>
        <h1>Adicionar Novo Produto</h1>
        
        <?php if(isset($_GET['error'])): ?>
            <div class="message-feedback" style="background-color: #ffcccc; color: #cc0000;">
                Erro: <?php echo htmlspecialchars($_GET['error']); ?>
            </div>
        <?php endif; ?>
        <?php if (count($categories) == 0): ?>
            <div class="message-feedback" style="background-color: #ffeeba; color: #856404;">
                <strong>Atenção!</strong> Você precisa cadastrar as categorias primeiro. 
                <a href="gerenciar-categorias.php" style="color: #856404; font-weight: bold;">Clique aqui</a>.
            </div>
        <?php endif; ?>

        <form action="process_add_product.php" method="POST" enctype="multipart/form-data">
            
            <div class="input-group">
                <label for="name">Nome do Produto:</label>
                <input type="text" id="name" name="name" required>
            </div>
            
            <div class="input-group">
                <label for="description">Descrição:</label>
                <textarea id="description" name="description" rows="3"></textarea>
            </div>
            
            <div class="input-group">
                <label for="category_id">Categoria:</label>
                <select id="category_id" name="category_id" required>
                    <option value="">Selecione uma categoria</option>
                    <?php foreach ($categories as $category): ?>
                        <option value="<?php echo $category->id; ?>">
                            <?php echo htmlspecialchars($category->name); ?>
                        </option>
                    <?php endforeach; ?>
                </select>
            </div>

            <div class="input-group">
                <label for="price">Preço Normal (ex: 12.50):</label>
                <input type="number" step="0.01" id="price" name="price" required>
            </div>

            <div class="input-group-checkbox">
                <input type="checkbox" id="is_on_promotion" name="is_on_promotion" value="1">
                <label for="is_on_promotion">Este produto está em promoção?</label>
            </div>
            
            <div class="input-group" id="promotion_price_group" style="display: none;">
                <label for="promotion_price">Preço Promocional (ex: 9.90):</label>
                <input type="number" step="0.01" id="promotion_price" name="promotion_price">
            </div>
            
            <div class="input-group">
                <label for="image">Imagem do Produto:</label>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg, image/webp">
                <small>Formatos aceitos: PNG, JPG, WEBP.</small>
            </div>
            
          <button type="submit" <?php if (count($categories) == 0) echo 'disabled'; ?>>
              <i class="fa-solid fa-save"></i> Cadastrar Produto
          </button>
        </form>
    </div>

    <script>
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