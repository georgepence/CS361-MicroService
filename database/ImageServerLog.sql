-- BELOW CODE ADAPTED FROM www.phpmyadmin.net
-- phpMyAdmin SQL Dump
-- version 5.1.1-1.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Nov 03, 2021 at 11:37 AM
-- Server version: 10.4.21-MariaDB-log
-- PHP Version: 7.4.23

--  THIS SQL FILE CAN SET UP LOG DATABASE ON NEW HOST (SUCH AS HEROKU)

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs361_penceg`
--

-- --------------------------------------------------------

--
-- Table structure for table `ImageServerLog`
--

CREATE TABLE `ImageServerLog` (
  `id` int(11) NOT NULL,
  `time` timestamp NOT NULL DEFAULT current_timestamp(),
  `userInfo` varchar(20000) NOT NULL,
  `reqQuery` varchar(20000) DEFAULT NULL,
  `urlResult` varchar(20000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ImageServerLog`
--

--INSERT INTO `ImageServerLog` (`id`, `time`, `userInfo`, `reqQuery`, `urlResult`) VALUES
--(10, '2021-11-03 11:25:33', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', '{\"response_type\":\"link\"}', 'https://web.engr.oregonstate.edu/~penceg/images/large/3.jpeg'),
--(11, '2021-11-03 11:28:06', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', '{\"response_type\":\"link\"}', 'https://web.engr.oregonstate.edu/~penceg/images/large/2.jpeg'),
--(12, '2021-11-03 11:28:16', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', '{}', 'https://web.engr.oregonstate.edu/~penceg/images/large/12.jpeg'),
--(13, '2021-11-03 11:29:51', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', '{}', 'https://web.engr.oregonstate.edu/~penceg/images/large/14.jpeg'),
--(14, '2021-11-03 11:29:58', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', '{\"response_type\":\"link\"}', 'https://web.engr.oregonstate.edu/~penceg/images/large/1.jpeg'),
--(15, '2021-11-03 11:30:03', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36', '{\"response_type\":\"file\"}', 'https://web.engr.oregonstate.edu/~penceg/images/large/10.jpeg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ImageServerLog`
--
ALTER TABLE `ImageServerLog`
  ADD PRIMARY KEY (`id`,`userInfo`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ImageServerLog`
--
ALTER TABLE `ImageServerLog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
