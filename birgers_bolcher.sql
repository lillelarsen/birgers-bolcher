-- phpMyAdmin SQL Dump
-- version 4.3.11
-- http://www.phpmyadmin.net
--
-- Vært: 127.0.0.1
-- Genereringstid: 02. 10 2018 kl. 14:10:59
-- Serverversion: 5.6.24
-- PHP-version: 5.6.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `birgers_bolcher`
--

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `sourness`
--

CREATE TABLE IF NOT EXISTS `sourness` (
  `id` int(11) NOT NULL,
  `name` varchar(12) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `sourness`
--

INSERT INTO `sourness` (`id`, `name`) VALUES
(1, 'Sødt'),
(2, 'Let bittert'),
(3, 'Bittert');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `strenght`
--

CREATE TABLE IF NOT EXISTS `strenght` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `strenght`
--

INSERT INTO `strenght` (`id`, `name`) VALUES
(1, 'Mild'),
(2, 'Medium'),
(3, 'Stærk');

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `sweets`
--

CREATE TABLE IF NOT EXISTS `sweets` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `color` varchar(8) NOT NULL,
  `weight` int(11) NOT NULL,
  `flavour_sourness` int(11) NOT NULL,
  `flavour_strenght` int(11) NOT NULL,
  `flavour_type` int(11) NOT NULL,
  `raw_materials_price` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `sweets`
--

INSERT INTO `sweets` (`id`, `name`, `color`, `weight`, `flavour_sourness`, `flavour_strenght`, `flavour_type`, `raw_materials_price`) VALUES
(1, 'Jordbær', 'Rød', 11, 1, 1, 1, 16),
(2, 'Appelsin', 'Orange', 12, 1, 1, 2, 13),
(3, 'Citron', 'Gul', 10, 3, 1, 3, 14),
(4, 'Salmiaktop', 'Sort', 6, 1, 3, 4, 12),
(5, 'Blå Haj', 'Lyseblå', 22, 2, 2, 5, 19),
(6, 'Rød Perle', 'Rød', 8, 1, 2, 1, 9),
(7, 'Gul Perle', 'Gul', 8, 3, 2, 3, 10),
(8, 'Blå Perle', 'Blå', 8, 2, 3, 5, 11);

-- --------------------------------------------------------

--
-- Struktur-dump for tabellen `type`
--

CREATE TABLE IF NOT EXISTS `type` (
  `id` int(11) NOT NULL,
  `name` varchar(12) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Data dump for tabellen `type`
--

INSERT INTO `type` (`id`, `name`) VALUES
(1, 'Jordbær'),
(2, 'Appelsin'),
(3, 'Citron'),
(4, 'Salmial'),
(5, 'Anis');

--
-- Begrænsninger for dumpede tabeller
--

--
-- Indeks for tabel `sourness`
--
ALTER TABLE `sourness`
  ADD PRIMARY KEY (`id`);

--
-- Indeks for tabel `strenght`
--
ALTER TABLE `strenght`
  ADD PRIMARY KEY (`id`);

--
-- Indeks for tabel `sweets`
--
ALTER TABLE `sweets`
  ADD PRIMARY KEY (`id`);

--
-- Indeks for tabel `type`
--
ALTER TABLE `type`
  ADD PRIMARY KEY (`id`);

--
-- Brug ikke AUTO_INCREMENT for slettede tabeller
--

--
-- Tilføj AUTO_INCREMENT i tabel `sourness`
--
ALTER TABLE `sourness`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Tilføj AUTO_INCREMENT i tabel `strenght`
--
ALTER TABLE `strenght`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=4;
--
-- Tilføj AUTO_INCREMENT i tabel `sweets`
--
ALTER TABLE `sweets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- Tilføj AUTO_INCREMENT i tabel `type`
--
ALTER TABLE `type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
