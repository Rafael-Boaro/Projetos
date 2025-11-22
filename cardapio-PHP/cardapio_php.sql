-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Tempo de geração: 08-Nov-2025 às 19:21
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
-- Banco de dados: `cardapio_php`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `categories`
--

INSERT INTO `categories` (`id`, `user_id`, `name`) VALUES
(4, 4, 'refri');

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `is_on_promotion` tinyint(1) NOT NULL DEFAULT '0',
  `promotion_price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `products`
--

INSERT INTO `products` (`id`, `user_id`, `name`, `description`, `price`, `image_path`, `category_id`, `is_on_promotion`, `promotion_price`) VALUES
(3, 4, '1221', '1212', 131231.00, NULL, 4, 1, 12.00),
(2, 3, '31312', '3123', 2.00, NULL, 3, 1, 2.00),
(4, 4, '13123', '12313', 122.00, NULL, 4, 0, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `store_config`
--

DROP TABLE IF EXISTS `store_config`;
CREATE TABLE IF NOT EXISTS `store_config` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nomeLoja` varchar(100) NOT NULL,
  `whatsappNumero` varchar(50) NOT NULL,
  `enderecoTexto` varchar(255) NOT NULL,
  `horario_seg` varchar(50) NOT NULL,
  `horario_ter` varchar(50) NOT NULL,
  `horario_qua` varchar(50) NOT NULL,
  `horario_qui` varchar(50) NOT NULL,
  `horario_sex` varchar(50) NOT NULL,
  `horario_sab` varchar(50) NOT NULL,
  `horario_dom` varchar(50) NOT NULL,
  `cor_primaria` varchar(7) NOT NULL,
  `cor_secundaria` varchar(7) NOT NULL,
  `banner_image_path` varchar(255) NOT NULL DEFAULT 'uploads/default.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `store_config`
--

INSERT INTO `store_config` (`id`, `user_id`, `nomeLoja`, `whatsappNumero`, `enderecoTexto`, `horario_seg`, `horario_ter`, `horario_qua`, `horario_qui`, `horario_sex`, `horario_sab`, `horario_dom`, `cor_primaria`, `cor_secundaria`, `banner_image_path`) VALUES
(3, 4, 'Nome da Loja', '(00) 00000-0000', 'Seu Endereço Aqui', 'Fechado', '18h às 23h', '18h às 23h', '18h às 23h', '18h às 00h', '18h às 00h', 'Fechado', '#a90e0e', '#ff7f0a', 'uploads/banner_690f9829d5fe27.77693032.png');

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
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`) VALUES
(1, 'admin', '$2b$10$Y4zIJcYiCxUiyoqCKMdP/uClWfkmKkbj.hPaEH/8evQwXwCGfMu8a', 'superadmin'),
(4, 'Texas', '$2y$10$yeANzhBgbcJQYSJ3cauloefon/4JAhK00tSALR92WV/G4BQ7m32xe', 'store');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
