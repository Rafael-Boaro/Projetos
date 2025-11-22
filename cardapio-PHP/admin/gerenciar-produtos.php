<?php
// /cardapio-php/admin/gerenciar-produtos.php (TOTALMENTE ATUALIZADO)

require_once 'auth_check.php';

$logged_user_id = $_SESSION['user_id'];

// Lógica da Barra de Pesquisa
$search_term = '';
$sql = "SELECT p.*, c.name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.id 
        WHERE p.user_id = ?";

if (isset($_GET['search']) && !empty($_GET['search'])) {
    $search_term = $_GET['search'];
    $sql .= " AND p.name LIKE ?";
    $params = [$logged_user_id, "%" . $search_term . "%"];
} else {
    $params = [$logged_user_id];
}

// Corrigido: Ordena por category_id (não 'category')
$sql .= " ORDER BY p.category_id, p.name"; 

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll(PDO::FETCH_OBJ);

?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gerenciar Produtos</title>
    <link rel="stylesheet" href="../css/admin.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
</head>
<body class="dashboard">

    <nav class="admin-navbar">
        <a href="dashboard.php" class="logo">Painel Admin</a>
        <div class="nav-links">
            <a href="../index.php" target="_blank">Ver Site</a>
            <a href="logout.php" class="logout-btn">Sair</a>
        </div>
    </nav>

    <div class="admin-container">
        <a href="dashboard.php" class="back-link"><i class="fa-solid fa-arrow-left"></i> Voltar ao Dashboard</a>
        
        <div class="page-header">
            <h1>Gerenciar Produtos</h1>
            <div>
                <a href="gerenciar-categorias.php" class="btn-secondary">
                    <i class="fa-solid fa-tags"></i> Gerenciar Categorias
                </a>
                <a href="adicionar-produto.php" class="btn-primary">
                    <i class="fa-solid fa-plus"></i> Adicionar Produto
                </a>
            </div>
        </div>

        <form action="gerenciar-produtos.php" method="GET" class="search-form">
            <div class="input-group">
                <input type="text" name="search" placeholder="Buscar pelo nome do produto..." 
                       value="<?php echo htmlspecialchars($search_term); ?>">
                <button type="submit"><i class="fa-solid fa-search"></i> Buscar</button>
            </div>
        </form>

        <table class="product-table">
            <thead>
                <tr>
                    <th>Imagem</th>
                    <th>Nome</th>
                    <th>Status</th>
                    <th>Preço</th>
                    <th>Categoria</th> <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <?php if (count($products) > 0): ?>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td>
                                <?php if (!empty($product->image_path)): ?>
                                    <img src="../<?php echo htmlspecialchars($product->image_path); ?>" alt="<?php echo htmlspecialchars($product->name); ?>">
                                <?php else: ?>
                                    <img src="../uploads/default.png" alt="Sem Imagem">
                                <?php endif; ?>
                            </td>
                            <td><?php echo htmlspecialchars($product->name); ?></td>
                            
                            <td>
                                <?php if ($product->is_on_promotion): ?>
                                    <span class="status-promo">Em Promoção</span>
                                <?php else: ?>
                                    <span class="status-normal">Normal</span>
                                <?php endif; ?>
                            </td>
                            
                            <td>
                                <?php if ($product->is_on_promotion && $product->promotion_price > 0): ?>
                                    <span class="price-old">R$ <?php echo number_format($product->price, 2, ',', '.'); ?></span>
                                    <span class="price-promo">R$ <?php echo number_format($product->promotion_price, 2, ',', '.'); ?></span>
                                <?php else: ?>
                                    R$ <?php echo number_format($product->price, 2, ',', '.'); ?>
                                <?php endif; ?>
                            </td>
                            
                            <td>
                                <?php echo htmlspecialchars($product->category_name ?? 'Sem Categoria'); ?>
                            </td>
                            
                            <td>
                               <a href="editar-produto.php?id=<?php echo $product->id; ?>" class="btn-action btn-edit"><i class="fa-solid fa-pencil"></i> Editar</a>
                                <a href="excluir-produto.php?id=<?php echo $product->id; ?>" class="btn-action btn-delete" 
                                   onclick="return confirm('Tem certeza que deseja excluir este produto?');">
                                   <i class="fa-solid fa-trash"></i> Excluir
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php else: ?>
                    <tr>
                        <td colspan="6">
                            <?php if (!empty($search_term)): ?>
                                Nenhum produto encontrado para "<?php echo htmlspecialchars($search_term); ?>".
                            <?php else: ?>
                                Nenhum produto cadastrado ainda.
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endif; ?>
            </tbody>
        </table>
    </div>

    <style>
    .page-header { flex-wrap: wrap; gap: 10px; }
    .page-header > div { display: flex; gap: 10px; flex-wrap: wrap; }
    .btn-secondary {
        background-color: #6c757d;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        text-decoration: none;
        display: inline-block;
        text-align: center;
        transition: background-color 0.2s, transform 0.2s;
    }
    .btn-secondary:hover {
        background-color: #5a6268;
        transform: translateY(-2px);
    }
    </style>
</body>
</html>