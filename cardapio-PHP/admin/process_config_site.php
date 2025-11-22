<?php
// /cardapio-php/admin/process_config_site.php (ATUALIZADO)

// 1. Inclui o Porteiro!
require_once 'auth_check.php';

// Define o diretório de UPLOADS
define('UPLOAD_DIR', '../uploads/');
// Garante que o diretório de uploads exista
if (!is_dir(UPLOAD_DIR)) {
    mkdir(UPLOAD_DIR, 0755, true);
}

// 2. Verifica se os dados vieram via POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // 3. Pega o ID do usuário logado
    $logged_user_id = $_SESSION['user_id'];

    // 4. Pega TODOS os dados de texto do formulário
    $nomeLoja = $_POST['nomeLoja'];
    $whatsappNumero = $_POST['whatsappNumero'];
    $enderecoTexto = $_POST['enderecoTexto'];
    $horario_seg = $_POST['horario_seg'];
    $horario_ter = $_POST['horario_ter'];
    $horario_qua = $_POST['horario_qua'];
    $horario_qui = $_POST['horario_qui'];
    $horario_sex = $_POST['horario_sex'];
    $horario_sab = $_POST['horario_sab'];
    $horario_dom = $_POST['horario_dom'];
    $cor_primaria = $_POST['cor_primaria'];
    $cor_secundaria = $_POST['cor_secundaria'];
    
    // 5. Pega os dados da imagem
    $old_banner_image = $_POST['old_banner_image'];
    $new_banner_path = $old_banner_image; // Assume que a imagem não vai mudar
    $file_uploaded = false;

    // 6. LÓGICA DE UPLOAD (Se uma NOVA imagem foi enviada)
    if (isset($_FILES['banner_image']) && $_FILES['banner_image']['error'] == 0) {
        
        $file = $_FILES['banner_image'];
        $fileName = $file['name'];
        $fileTmpName = $file['tmp_name'];
        $fileSize = $file['size'];
        $fileError = $file['error'];
        
        $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'webp'];

        if (in_array($fileExt, $allowed)) {
            if ($fileError === 0) {
                if ($fileSize < 5000000) { // 5MB
                    $fileNameNew = uniqid('banner_', true) . "." . $fileExt;
                    $fileDestination = UPLOAD_DIR . $fileNameNew;
                    
                    if (move_uploaded_file($fileTmpName, $fileDestination)) {
                        $new_banner_path = 'uploads/' . $fileNameNew; // Caminho relativo
                        $file_uploaded = true;
                    } else {
                        header("Location: config-site.php?error=Falha ao mover o arquivo.");
                        exit;
                    }
                } else {
                    header("Location: config-site.php?error=Arquivo muito grande (max 5MB).");
                    exit;
                }
            } else {
                header("Location: config-site.php?error=Erro no upload do arquivo.");
                exit;
            }
        } else {
            header("Location: config-site.php?error=Tipo de arquivo não permitido.");
            exit;
        }
    }

    // 7. ATUALIZA o Banco de Dados
    try {
        $stmt = $pdo->prepare(
            "UPDATE store_config SET 
                nomeLoja = ?, whatsappNumero = ?, enderecoTexto = ?, 
                horario_seg = ?, horario_ter = ?, horario_qua = ?, 
                horario_qui = ?, horario_sex = ?, horario_sab = ?, 
                horario_dom = ?, cor_primaria = ?, cor_secundaria = ?,
                banner_image_path = ? 
             WHERE user_id = ?"
        );
        
        $stmt->execute([
            $nomeLoja, $whatsappNumero, $enderecoTexto,
            $horario_seg, $horario_ter, $horario_qua,
            $horario_qui, $horario_sex, $horario_sab,
            $horario_dom, $cor_primaria, $cor_secundaria,
            $new_banner_path, // Salva o caminho (novo ou o antigo)
            $logged_user_id
        ]);

        // 8. Se o upload deu certo, APAGA O ARQUIVO ANTIGO
        //    (Mas não apague se o arquivo antigo for o 'default.png')
        if ($file_uploaded && !empty($old_banner_image) && $old_banner_image != $new_banner_path && $old_banner_image != 'uploads/default.png') {
            $full_old_path = '../' . $old_banner_image;
            if (file_exists($full_old_path)) {
                unlink($full_old_path);
            }
        }
        
        // 9. Sucesso!
        header("Location: config-site.php?success=1");
        exit;

    } catch (PDOException $e) {
        die("Erro ao salvar configurações: " . $e->getMessage());
    }

} else {
    // Se acessar direto, chuta para o dashboard
    header("Location: dashboard.php");
    exit;
}
?>