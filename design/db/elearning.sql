-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: elearning
-- ------------------------------------------------------
-- Server version	5.5.5-10.2.14-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `level` tinyint(3) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_groups_categories_idx` (`category_id`),
  KEY `name_idx` (`name`),
  KEY `level_idx` (`level`),
  CONSTRAINT `fk_groups_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `memberships`
--

DROP TABLE IF EXISTS `memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `memberships` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` decimal(5,2) unsigned NOT NULL,
  `valid_days` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberships`
--

LOCK TABLES `memberships` WRITE;
/*!40000 ALTER TABLE `memberships` DISABLE KEYS */;
/*!40000 ALTER TABLE `memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists`
--

DROP TABLE IF EXISTS `playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlists` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `level` tinyint(3) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `level_idx` (`level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists`
--

LOCK TABLES `playlists` WRITE;
/*!40000 ALTER TABLE `playlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playlists_videos`
--

DROP TABLE IF EXISTS `playlists_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `playlists_videos` (
  `playlist_id` int(10) unsigned NOT NULL,
  `video_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`playlist_id`,`video_id`),
  KEY `fk_playlists_videos_playlists_idx` (`playlist_id`),
  KEY `fk_playlists_videos_videos_idx` (`video_id`),
  CONSTRAINT `fk_playlists_videos_playlists` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_playlists_videos_videos` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playlists_videos`
--

LOCK TABLES `playlists_videos` WRITE;
/*!40000 ALTER TABLE `playlists_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `playlists_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(10) unsigned zerofill NOT NULL,
  `user_id` int(10) unsigned zerofill NOT NULL,
  `parent_post_id` int(10) unsigned DEFAULT NULL,
  `content` text NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `background` tinyint(3) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_posts_groups_idx` (`group_id`),
  KEY `fk_posts_users_idx` (`user_id`),
  KEY `fk_posts_posts_idx` (`parent_post_id`),
  KEY `created_at_idx` (`created_at`),
  CONSTRAINT `fk_posts_groups` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_posts` FOREIGN KEY (`parent_post_id`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_likes`
--

DROP TABLE IF EXISTS `posts_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts_likes` (
  `post_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`post_id`,`user_id`),
  KEY `fk_posts_likes_posts_idx` (`post_id`),
  KEY `fk_posts_likes_users_idx` (`user_id`),
  CONSTRAINT `fk_posts_likes_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_likes_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_likes`
--

LOCK TABLES `posts_likes` WRITE;
/*!40000 ALTER TABLE `posts_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_reports`
--

DROP TABLE IF EXISTS `posts_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts_reports` (
  `post_id` int(10) unsigned NOT NULL,
  `reporting_user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`post_id`,`reporting_user_id`),
  KEY `fk_posts_reports_posts_idx` (`post_id`),
  KEY `fk_posts_reports_users_idx` (`reporting_user_id`),
  CONSTRAINT `fk_posts_reports_posts` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_posts_reports_users` FOREIGN KEY (`reporting_user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_reports`
--

LOCK TABLES `posts_reports` WRITE;
/*!40000 ALTER TABLE `posts_reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `posts_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(50) CHARACTER SET ascii DEFAULT NULL,
  `phone` varchar(20) CHARACTER SET ascii DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET ascii DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `portrait` varchar(255) CHARACTER SET ascii DEFAULT NULL,
  `login_type` tinyint(3) unsigned DEFAULT 0,
  `level` tinyint(3) unsigned DEFAULT 0,
  `account_balance` int(10) unsigned DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `email_password_idx` (`email`,`password`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_absence_log`
--

DROP TABLE IF EXISTS `users_absence_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_absence_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_absense_users_idx` (`user_id`),
  CONSTRAINT `fk_absense_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_absence_log`
--

LOCK TABLES `users_absence_log` WRITE;
/*!40000 ALTER TABLE `users_absence_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_absence_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_memberships`
--

DROP TABLE IF EXISTS `users_memberships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_memberships` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `membership_id` int(10) unsigned NOT NULL,
  `purchased_at` datetime NOT NULL,
  `valid` tinyint(3) unsigned DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `fk_users_memberships_users_idx` (`user_id`),
  KEY `fk_users_memberships_memberships_idx` (`membership_id`),
  CONSTRAINT `fk_users_memberships_memberships` FOREIGN KEY (`membership_id`) REFERENCES `memberships` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_memberships_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_memberships`
--

LOCK TABLES `users_memberships` WRITE;
/*!40000 ALTER TABLE `users_memberships` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_memberships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_playlists`
--

DROP TABLE IF EXISTS `users_playlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_playlists` (
  `user_id` int(10) unsigned NOT NULL,
  `playlist_id` int(10) unsigned NOT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`user_id`,`playlist_id`),
  KEY `fk_users_playlists_users_idx` (`user_id`),
  KEY `fk_users_playlists_playlists_idx` (`playlist_id`),
  CONSTRAINT `fk_users_playlists_playlists` FOREIGN KEY (`playlist_id`) REFERENCES `playlists` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_playlists_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_playlists`
--

LOCK TABLES `users_playlists` WRITE;
/*!40000 ALTER TABLE `users_playlists` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_playlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_scores`
--

DROP TABLE IF EXISTS `users_scores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_scores` (
  `user_id` int(10) unsigned NOT NULL,
  `video_id` int(10) unsigned NOT NULL,
  `watch_score` int(10) unsigned NOT NULL DEFAULT 0,
  `vocab_score` int(10) unsigned NOT NULL DEFAULT 0,
  `test_score` int(10) unsigned NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`video_id`),
  KEY `fk_users_scores_videos_idx` (`video_id`),
  KEY `fk_users_scores_users_idx` (`user_id`),
  CONSTRAINT `fk_users_scores_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_scores_videos` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_scores`
--

LOCK TABLES `users_scores` WRITE;
/*!40000 ALTER TABLE `users_scores` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_scores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_videos`
--

DROP TABLE IF EXISTS `users_videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_videos` (
  `user_id` int(10) unsigned NOT NULL,
  `video_id` int(10) unsigned NOT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`user_id`,`video_id`),
  KEY `fk_users_videos_users_idx` (`user_id`),
  KEY `fk_users_videos_videos_idx` (`video_id`),
  CONSTRAINT `fk_users_videos_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_videos_videos` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_videos`
--

LOCK TABLES `users_videos` WRITE;
/*!40000 ALTER TABLE `users_videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_vocabs`
--

DROP TABLE IF EXISTS `users_vocabs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_vocabs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `vocab` varchar(45) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_users_vocabs_idx` (`user_id`),
  CONSTRAINT `fk_users_vocabs` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_vocabs`
--

LOCK TABLES `users_vocabs` WRITE;
/*!40000 ALTER TABLE `users_vocabs` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_vocabs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `videos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(10) unsigned DEFAULT NULL,
  `level` tinyint(3) unsigned DEFAULT NULL,
  `title` varchar(50) NOT NULL,
  `url` varchar(255) CHARACTER SET ascii NOT NULL,
  `subtitle_url` varchar(255) CHARACTER SET ascii DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_videos_categories_idx` (`category_id`),
  KEY `title_idx` (`title`),
  KEY `level_idx` (`level`),
  CONSTRAINT `fk_videos_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-01 23:56:17
