-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 06-Nov-2025 às 19:24
-- Versão do servidor: 9.1.0
-- versão do PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `cardapio_online`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `delivery_type` varchar(100) NOT NULL,
  `discount` decimal(10,2) NOT NULL,
  `final_price` decimal(10,2) NOT NULL,
  `order_status` varchar(50) NOT NULL DEFAULT 'Pendente',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `orders`
--

INSERT INTO `orders` (`id`, `delivery_type`, `discount`, `final_price`, `order_status`, `created_at`) VALUES
(1, 'Retirada no local', 0.00, 66.99, 'Concluído', '2025-10-29 19:59:42'),
(2, 'Retirada no local', 0.00, 114.99, 'Concluído', '2025-10-29 20:23:11'),
(3, 'Retirada no local', 0.00, 48.00, 'Concluído', '2025-10-30 20:05:54'),
(4, 'Retirada no local', 0.00, 78.00, 'Cancelado', '2025-11-01 19:24:27'),
(5, 'Retirada no local', 0.00, 108.00, 'Concluído', '2025-11-01 19:25:31'),
(6, 'Retirada no local', 0.00, 108.00, 'Concluído', '2025-11-01 19:43:39'),
(7, 'Delivery', 0.00, 111.00, 'Cancelado', '2025-11-01 19:43:45');

-- --------------------------------------------------------

--
-- Estrutura da tabela `order_items`
--

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `item_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`)
) ENGINE=MyISAM AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `quantity`, `item_price`) VALUES
(1, 1, 101, 1, 30.99),
(2, 1, 301, 1, 6.00),
(3, 1, 1, 1, 14.00),
(4, 1, 2, 1, 16.00),
(5, 2, 101, 1, 30.99),
(6, 2, 301, 1, 6.00),
(7, 2, 1, 2, 14.00),
(8, 2, 2, 2, 16.00),
(9, 2, 3, 1, 18.00),
(10, 3, 1, 1, 14.00),
(11, 3, 2, 1, 16.00),
(12, 3, 3, 1, 18.00),
(13, 4, 1, 2, 14.00),
(14, 4, 2, 2, 16.00),
(15, 4, 3, 1, 18.00),
(16, 5, 1, 3, 14.00),
(17, 5, 2, 3, 16.00),
(18, 5, 3, 1, 18.00),
(19, 6, 1, 3, 14.00),
(20, 6, 2, 3, 16.00),
(21, 6, 3, 1, 18.00),
(22, 7, 1, 3, 14.00),
(23, 7, 2, 3, 16.00),
(24, 7, 3, 1, 18.00);

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL,
  `type` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `lastPrice` decimal(10,2) NOT NULL,
  `img` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `products`
--

INSERT INTO `products` (`id`, `type`, `name`, `description`, `price`, `lastPrice`, `img`) VALUES
(1, 1, 'X-Egg', 'Pão, hamburger, ovo, queijo prato, alface, tomate e molho especial.', 14.00, 0.00, 'burger.png'),
(2, 1, 'X-Salada', 'Pão, hamburger, presunto, picles, alface, tomate e molho especial.', 16.00, 0.00, 'burger.png'),
(3, 1, 'X-Bacon', 'Pão, hamburger, ovo, bacon, queijo prato, presunto, cebola caramelizada e molho especial.', 18.00, 0.00, 'burger.png'),
(4, 1, 'X-Tudo', 'Pão, hamburger, ovo, bacon, queijo prato, presunto, cebola caramelizada, picles, alface, tomate e molho especial.', 25.00, 0.00, 'xtudo.png'),
(5, 1, 'X-Promo', 'Pão, hamburger, ovo, bacon, queijo prato, presunto, cebola caramelizada, picles, alface, tomate e molho especial.', 19.99, 25.00, 'burger.png'),
(102, 2, 'Combo Médio', '3 x-bacon, 3 coca-cola lata e 3 batatas fritas médias.', 45.99, 50.00, 'combo.png'),
(103, 2, 'Combo Grande', '4 x-tudo, 3 coca-cola lata e 3 batatas fritas grandes.', 68.99, 75.00, 'combo.png'),
(301, 4, 'Coca-Cola Lata', '1 coca-cola lata.', 6.00, 0.00, 'cocacola.png'),
(302, 4, 'Fanta Laranja Lata', '1 fanta laranja lata.', 5.00, 0.00, 'fanta.png'),
(303, 4, 'Pepsi Lata', '1 pepsi lata.', 4.50, 0.00, 'pepsi.png');

-- --------------------------------------------------------

--
-- Estrutura da tabela `store_config`
--

DROP TABLE IF EXISTS `store_config`;
CREATE TABLE IF NOT EXISTS `store_config` (
  `id` int NOT NULL DEFAULT '1',
  `nomeLoja` varchar(100) NOT NULL,
  `whatsappLink` varchar(255) NOT NULL,
  `whatsappNumero` varchar(50) NOT NULL,
  `enderecoTexto` varchar(255) NOT NULL,
  `mapaLink` varchar(1000) NOT NULL,
  `social_facebook` varchar(255) NOT NULL,
  `social_instagram` varchar(255) NOT NULL,
  `social_twitter` varchar(255) NOT NULL,
  `sobreTitulo` varchar(255) NOT NULL,
  `sobreTexto` text NOT NULL,
  `rodapeQuemSomos` text NOT NULL,
  `horario_dom` varchar(50) NOT NULL,
  `horario_seg` varchar(50) NOT NULL,
  `horario_ter` varchar(50) NOT NULL,
  `horario_qua` varchar(50) NOT NULL,
  `horario_qui` varchar(50) NOT NULL,
  `horario_sex` varchar(50) NOT NULL,
  `horario_sab` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `store_config`
--

INSERT INTO `store_config` (`id`, `nomeLoja`, `whatsappLink`, `whatsappNumero`, `enderecoTexto`, `mapaLink`, `social_facebook`, `social_instagram`, `social_twitter`, `sobreTitulo`, `sobreTexto`, `rodapeQuemSomos`, `horario_dom`, `horario_seg`, `horario_ter`, `horario_qua`, `horario_qui`, `horario_sex`, `horario_sab`) VALUES
(1, 'PIZZARIA DO ZÉ', 'https://wa.me/5514991234567', '(14) 99123-4567', 'Rua dos Famintos, nº 100<br>Famintoslândia (SP)', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3707.1133601811925!2d-49.75473017539938!3d-21.698321939707288!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94be15ecb135a5dd%3A0x66b807178c781125!2sFATEC%20Lins!5e0!3m2!1spt-BR!2sbr!4v1652099486542!5m2!1spt-BR!2sbr', '#', '#', '#', 'Cardápio online', 'Seja bem-vindo ao cardápio online da lanchonete <span>SPACE BURGER</span>! Este aplicativo web tem o intuito de facilitar os pedidos...', 'Somos uma empresa do ramo alimentício presente no mercado desde 2015 com serviços e produtos de ótima qualidade.', '19h às 00h', 'Fechado', 'Fechado', '19h às 00h', '19h às 00h', '19h às 00h', '19h às 00h');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'store',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`) VALUES
(1, 'admin', '$2b$10$vYnYOfkDPcEBhOyukUgdNuxQizti.XfugOOelqHkd8L1ClNdOLTmq', 'superadmin'),
(2, 'loja1', '$2b$10$.Er0RWJ0GEN40Os9oEqile81O2I2MA5P.AHO.iWomldJHdyU0pBJG', 'store'),
(3, 'loja2', '$2b$10$jgC5TIYXpiH8uv.eJnAs3OCCCdg4h/vid4MmN.VTrk1T1CiGVCPEq', 'store');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
