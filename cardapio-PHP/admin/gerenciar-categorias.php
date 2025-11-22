<?php
// /cardapio-php/admin/gerenciar-categorias.php

// 1. Inclui o Porteiro Super Admin!
require_once 'auth_check.php';

$logged_user_id = $_SESSION['user_id'];

// 2. Lógica de ADICIONAR Categoria
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST['category_name'])) {
    try {
        $stmt = $pdo->prepare("INSERT INTO categories (user_id, name) VALUES (?, ?)");
        $stmt->execute([$logged_user_id, $_POST['category_name']]);
        header("Location: gerenciar-categorias.php?success=1");
        exit;
    } catch (PDOException $e) {
        header("Location: gerenciar-categorias.php?error=" . $e->getMessage());
        exit;
    }
}

// 3. Lógica de EXCLUIR Categoria
if (isset($_GET['delete_id'])) {
    try {
        $stmt = $pdo->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");
        $stmt->execute([$_GET['delete_id'], $logged_user_id]);
        
        // (Opcional: Desvincular produtos desta categoria)
        $stmt_update = $pdo->prepare("UPDATE products SET category_id = NULL WHERE category_id = ?");
        $stmt_update->execute([$_GET['delete_id']]);
        
        header("Location: gerenciar-categorias.php?success=2");
        exit;
    } catch (PDOException $e) {
        header("Location: gerenciar-categorias.php?error=" . $e->getMessage());
        exit;
    }
}

// 4. Busca todas as categorias
$stmt = $pdo->prepare("SELECT * FROM categories WHERE user_id = ? ORDER BY name");
$stmt->execute([$logged_user_id]);
$categories = $stmt->fetchAll(PDO::FETCH_OBJ);

?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale-1.0">
    <title>Gerenciar Categorias</title>
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
            <h1>Gerenciar Categorias</h1>
        </div>

        <div class="category-manager">
            <div class="form-container">
                <h2>Adicionar Nova Categoria</h2>
                <form action="gerenciar-categorias.php" method="POST">
                    <div class="input-group">
                        <label for="category_name">Nome da Categoria (ex: Lanches):</label>
                        <input type="text" id="category_name" name="category_name" required>
                    </div>
                    <button type="submit"><i class="fa-solid fa-plus"></i> Adicionar Categoria</button>
                </form>
            </div>

            <div class="list-container">
                <h2>Categorias Existentes</h2>
                <table class="product-table">
                    <thead>
                        <tr>
                            <th>Nome da Categoria</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (count($categories) > 0): ?>
                            <?php foreach ($categories as $category): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($category->name); ?></td>
                                    <td>
                                        <a href="gerenciar-categorias.php?delete_id=<?php echo $category->id; ?>" 
                                           class="btn-action btn-delete" 
                                           onclick="return confirm('Tem certeza? Isso irá desvincular produtos desta categoria.');">
                                           <i class="fa-solid fa-trash"></i> Excluir
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php else: ?>
                            <tr>
                                <td colspan="2">Nenhuma categoria cadastrada.</td>
                            </tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    
    <style>
        .category-manager {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }
        @media (max-width: 900px) {
            .category-manager {
                grid-template-columns: 1fr;
            }
        }
        .form-container, .list-container {
            background: #fdfdfd;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid var(--cor-borda);
        }
    </style>
</body>
</html>