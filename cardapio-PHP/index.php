<?php
// /index.php (AGORA 100% COMPLETO)

// 1. Inclui a conexão
require_once 'db.php';

// 2. Busca a PRIMEIRA (e única) configuração de loja
try {
    $stmt_config = $pdo->prepare("SELECT * FROM store_config LIMIT 1");
    $stmt_config->execute();
    $config = $stmt_config->fetch(PDO::FETCH_OBJ);

    if (!$config) {
        die("Configuração da loja não encontrada. Acesse o painel admin para criar uma.");
    }

    // 3. Usa o user_id (DESSA config) para buscar os produtos
    $store_user_id = $config->user_id;

    // 4. LÓGICA DE BUSCA
    
    // 4a. Busca APENAS produtos em promoção
    $stmt_promo = $pdo->prepare(
        "SELECT * FROM products WHERE user_id = ? AND is_on_promotion = 1"
    );
    $stmt_promo->execute([$store_user_id]);
    $promotions = $stmt_promo->fetchAll(PDO::FETCH_OBJ);
    
    // 4b. Busca produtos NORMAIS (que NÃO estão em promoção)
    $stmt_products = $pdo->prepare(
        "SELECT p.*, c.name as category_name 
         FROM products p
         JOIN categories c ON p.category_id = c.id
         WHERE p.user_id = ? AND p.is_on_promotion = 0
         ORDER BY c.name, p.name"
    );
    $stmt_products->execute([$store_user_id]);
    $products_list = $stmt_products->fetchAll(PDO::FETCH_OBJ);

} catch (PDOException $e) {
    die("Erro ao carregar o cardápio: " . $e->getMessage());
}

// 5. Organiza o menu normal
$menu = [];
foreach ($products_list as $product) {
    if (empty($product->category_name)) continue;
    $category_name = $product->category_name;
    if (!isset($menu[$category_name])) {
        $menu[$category_name] = [
            'id' => $product->category_id,
            'products' => []
        ];
    }
    $menu[$category_name]['products'][] = $product;
}

// 6. Mapeia os horários
$horarios = [
    'horario-dom' => $config->horario_dom,
    'horario-seg' => $config->horario_seg,
    'horario-ter' => $config->horario_ter,
    'horario-qua' => $config->horario_qua,
    'horario-qui' => $config->horario_qui,
    'horario-sex' => $config->horario_sex,
    'horario-sab' => $config->horario_sab,
];

// 7. Link do WhatsApp (e número puro para o JS)
$whatsapp_number_only = preg_replace('/\D/', '', $config->whatsappNumero);
$whatsapp_link = "https://wa.me/" . $whatsapp_number_only;
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">
    <title><?php echo htmlspecialchars($config->nomeLoja); ?> | Cardápio</title>
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
    <style>
        :root {
            --cor-primaria: <?php echo htmlspecialchars($config->cor_primaria); ?>;
            --cor-secundaria: <?php echo htmlspecialchars($config->cor_secundaria); ?>;
        }
    </style>
</head>
<body>

    <div class="navbar">
        <div class="content">
            <a href="#" id="logo"><?php echo htmlspecialchars($config->nomeLoja); ?></a>
            <div class="items">
                <?php if (!empty($promotions)): ?>
                    <a href="#promotions">Promoções</a>
                <?php endif; ?>
                <a href="#menu">Cardápio</a>
                <a href="#service">Atendimento</a>
            </div>
            
            <div class="navbar-cta">
                <a href="#" class="cart-btn" id="cart-btn-desktop">
                    <span class="iconify-inline" data-icon="mdi:cart-variant"></span>
                    <span class="cart-count" id="cart-count-desktop">0</span>
                </a>
                <a href="admin/login.php" class="admin-link-desktop" title="Acesso Admin">
        <span class="iconify-inline" data-icon="mdi:shield-account"></span>
    </a>
                
                <a href="<?php echo $whatsapp_link; ?>" target="_blank" class="btn-cta">
                    <span class="iconify-inline" data-icon="akar-icons:whatsapp-fill"></span>
                    Fazer Pedido
                </a>
            </div>
            <div class="btnMobile">
                <span class="iconify-inline" data-icon="cil:burger"></span>
            </div>
        </div>
    </div>

    <div class="overlay"></div>
    <div class="mobile-drawer">
        <div class="drawer-header">
            <h4>Menu</h4>
            <div class="closeBtn">
                <span class="iconify-inline" data-icon="mdi:close"></span>
            </div>
        </div>
        
        <a href="#" class="cart-btn" id="cart-btn-mobile">
            <span class="iconify-inline" data-icon="mdi:cart-variant"></span>
            Meu Carrinho (<span class="cart-count" id="cart-count-mobile">0</span>)
        </a>
        <?php if (!empty($promotions)): ?>
            <a href="#promotions">Promoções</a>
        <?php endif; ?>
        <a href="#menu">Cardápio</a>
        <a href="#service">Atendimento</a>
        <a href="<?php echo $whatsapp_link; ?>" target="_blank" class="whatsapp-btn">
            <span class="iconify-inline" data-icon="akar-icons:whatsapp-fill"></span>
            Fazer Pedido
        </a>
    </div>

    <div class="banner">
        <div class="bannerContent">
            <div>
                <h1><?php echo htmlspecialchars($config->nomeLoja); ?></h1>
                <p id="subtitle">O melhor cardápio da região, direto na sua casa. Clique no botão abaixo e veja nossas opções!</p>
                <a href="<?php echo !empty($promotions) ? '#promotions' : '#menu'; ?>" class="btn">
                    <?php echo !empty($promotions) ? 'Ver Promoções' : 'Ver Cardápio'; ?>
                </a>
            </div>
            <img src="<?php echo htmlspecialchars(!empty($config->banner_image_path) ? $config->banner_image_path : 'uploads/default.png'); ?>" alt="<?php echo htmlspecialchars($config->nomeLoja); ?>">
        </div>
    </div>

    <div id="about">
        <div class="container">
            <h3>Sobre Nós</h3>
            <p>Seja bem-vindo! Explore nosso cardápio e faça seu pedido facilmente pelo WhatsApp.</p>
        </div>
    </div>

    <?php if (!empty($promotions)): ?>
    <div id="promotions" class="container">
        <h3>🔥 Nossas Promoções</h3>
        <div class="cardsMenu" id="showPromotions">
            
            <?php foreach ($promotions as $product): ?>
            <?php 
                $promo_final_price = $product->promotion_price ?? 0;
            ?>
            <div class="cardMenu promo-card">
                <div class="card-image">
                    <?php if (!empty($product->image_path)): ?>
                        <img src="<?php echo htmlspecialchars($product->image_path); ?>" alt="<?php echo htmlspecialchars($product->name); ?>">
                    <?php else: ?>
                        <img src="uploads/default.png" alt="Produto sem imagem">
                    <?php endif; ?>
                </div>
                <div class="card-info">
                    <h4><?php echo htmlspecialchars($product->name); ?></h4>
                    <p><?php echo htmlspecialchars($product->description); ?></p>
                    <div class="price-container">
                        <span class="old-price">R$ <?php echo number_format($product->price, 2, ',', '.'); ?></span>
                        <span class="promo-price">R$ <?php echo number_format($promo_final_price, 2, ',', '.'); ?></span>
                    </div>

                    <button class="add-to-cart-btn" 
                            data-id="<?php echo $product->id; ?>" 
                            data-name="<?php echo htmlspecialchars($product->name); ?>" 
                            data-price="<?php echo $promo_final_price; ?>">
                        Adicionar
                    </button>
                </div>
            </div>
            <?php endforeach; ?>

        </div>
    </div>
    <?php endif; ?>

    <div id="menu" class="container">
        <h3>Cardápio</h3>
        <div class="linksMenu">
            <button class="linkMenu active" data-filter="all">Tudo</button>
            <?php 
            foreach ($menu as $category_name => $data): 
                $category_slug = 'cat-' . $data['id']; 
            ?>
                <button class="linkMenu" data-filter="<?php echo htmlspecialchars($category_slug); ?>">
                    <?php echo htmlspecialchars($category_name); ?>
                </button>
            <?php endforeach; ?>
        </div>

        <div class="cardsMenu" id="showMenu">
            
            <?php if (empty($menu)): ?>
                <p>Nenhum produto cadastrado no momento. Volte em breve!</p>
            <?php else: ?>
                <?php 
                foreach ($menu as $category_name => $data): 
                    $category_slug = 'cat-' . $data['id']; 
                    foreach ($data['products'] as $product): 
                ?>
                        
                        <div class="cardMenu" data-category="<?php echo htmlspecialchars($category_slug); ?>">
                            <div class="card-image">
                                <?php if (!empty($product->image_path)): ?>
                                    <img src="<?php echo htmlspecialchars($product->image_path); ?>" alt="<?php echo htmlspecialchars($product->name); ?>">
                                <?php else: ?>
                                    <img src="uploads/default.png" alt="Produto sem imagem">
                                <?php endif; ?>
                            </div>
                            <div class="card-info">
                                <h4><?php echo htmlspecialchars($product->name); ?></h4>
                                <p><?php echo htmlspecialchars($product->description); ?></p>
                                <span class="price">R$ <?php echo number_format($product->price, 2, ',', '.'); ?></span>
                                
                                <button class="add-to-cart-btn"
                                        data-id="<?php echo $product->id; ?>" 
                                        data-name="<?php echo htmlspecialchars($product->name); ?>" 
                                        data-price="<?php echo $product->price; ?>">
                                    Adicionar
                                </button>
                            </div>
                        </div>

                    <?php 
                    endforeach; 
                endforeach; 
            endif; 
            ?>
        </div>
    </div>

    <div id="service" class="container">
        <h3>Atendimento</h3>
        <div class="locAndCont">
            <div class="cardLAC">
                <div class="circle">
                    <span class="iconify-inline" data-icon="akar-icons:location"></span>
                </div>
                <p><?php echo htmlspecialchars($config->enderecoTexto); ?></p>
            </div>
            <div class="cardLAC">
                <div class="circle">
                    <span class="iconify-inline" data-icon="akar-icons:phone"></span>
                </div>
                <p>Telefone de contato e Whatsapp<br>
                   <span><?php echo htmlspecialchars($config->whatsappNumero); ?></span>
                </p>
            </div>
        </div>
        
        <div class="days">
            <?php foreach ($horarios as $id => $horario_texto): ?>
                <div class="cardDays">
                    <h5><?php echo ucfirst(substr($id, 8)); ?></h5>
                    <p id="<?php echo $id; ?>"><?php echo htmlspecialchars($horario_texto); ?></p>
                </div>
            <?php endforeach; ?>
        </div>
    </div>

    <div class="footerBottom">
         <div class="content">
            <p><?php echo htmlspecialchars($config->nomeLoja); ?> - <?php echo date('Y'); ?> &copy; Todos os direitos reservados.</p>
        </div>
    </div>

    <div class="cart-overlay" id="cart-overlay"></div>
    <div class="cart-modal" id="cart-modal">
        
        <input type="hidden" id="whatsapp-number" value="<?php echo $whatsapp_number_only; ?>">
        
        <div class="cart-header">
            <h2>Meu Carrinho</h2>
            <button class="cart-close-btn" id="cart-close-btn">
                <span class="iconify-inline" data-icon="mdi:close"></span>
            </button>
        </div>
        
        <div class="cart-body" id="cart-body">
            </div>
        
        <div class="cart-footer">
            <div class="cart-total">
                <strong>Total:</strong>
                <span id="cart-total">R$ 0,00</span>
            </div>
            <button class="send-order-btn" id="send-order-btn">
                <span class="iconify-inline" data-icon="akar-icons:whatsapp-fill"></span>
                Enviar Pedido pelo WhatsApp
            </button>
        </div>
    </div>

    <script src="https://code.iconify.design/2/2.2.1/iconify.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>
    <script src="js/navbar.js"></script>
    <script src="js/menu-filter.js"></script>
    <script src="js/cart.js"></script>
</body>
</html>