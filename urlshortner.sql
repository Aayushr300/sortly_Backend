-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: urlshortner
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'admin','admin@gmail.com','$2b$10$H9SRuBkBlO4d4Q09jqeFxO117ZQ0vUCe3uDvJE4hkCgTkRmVLGDLy','2025-10-10 16:47:19');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clicks`
--

DROP TABLE IF EXISTS `clicks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clicks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `link_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `clicked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(45) DEFAULT NULL,
  `browser` varchar(255) DEFAULT NULL,
  `os` varchar(255) DEFAULT NULL,
  `device` varchar(255) DEFAULT NULL,
  `referrer` varchar(255) DEFAULT NULL,
  `referrer_category` varchar(100) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `gclid` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `link_id` (`link_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `clicks_ibfk_1` FOREIGN KEY (`link_id`) REFERENCES `short_urls` (`id`),
  CONSTRAINT `clicks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clicks`
--

LOCK TABLES `clicks` WRITE;
/*!40000 ALTER TABLE `clicks` DISABLE KEYS */;
INSERT INTO `clicks` VALUES (1,82,34,'2025-10-10 16:17:00','::1','Chrome 141.0.0','Windows 10.0.0','Other 0.0.0','Direct','Direct','Localhost',NULL);
/*!40000 ALTER TABLE `clicks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `order_id` varchar(100) NOT NULL,
  `payment_id` varchar(100) DEFAULT NULL,
  `invoice_url` varchar(255) DEFAULT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `invoices_ibfk_1` (`user_id`),
  CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `short_urls`
--

DROP TABLE IF EXISTS `short_urls`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `short_urls` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_url` text NOT NULL,
  `short_url` varchar(255) NOT NULL,
  `click` int DEFAULT '0',
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `alias_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alias_name` (`alias_name`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `short_urls_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `short_urls`
--

LOCK TABLES `short_urls` WRITE;
/*!40000 ALTER TABLE `short_urls` DISABLE KEYS */;
INSERT INTO `short_urls` VALUES (1,'https://www.google.com','CjlpwPO',0,NULL,'2025-06-25 08:22:19',1,NULL),(2,'https://www.google.com','agUSiwY',0,NULL,'2025-06-25 08:22:19',1,NULL),(3,'https://www.google.com','LRMM7mn',0,NULL,'2025-06-25 08:22:19',1,NULL),(4,'https://Horbax.o18.link/c?o=21313574&m=20733&a=603895','dPJ_zc7',0,NULL,'2025-06-25 08:22:19',1,NULL),(5,'https://offers-hub.co/Affiliate/c?o=121&a=1','tUiRt1a',0,NULL,'2025-06-25 08:22:19',1,NULL),(6,'https://offers-hub.co/Affiliate/c?o=121&a=1','KMCSrfA',0,NULL,'2025-06-25 08:22:19',1,NULL),(7,'https://offers-hub.co/Affiliate/c?o=121&a=1','MXlVFEc',0,NULL,'2025-06-25 08:22:19',1,NULL),(8,'https://www.google.com','1ujIAcQ',0,NULL,'2025-06-25 08:22:19',1,NULL),(9,'https://Horbax.o18.link/c?o=21313574&m=20733&a=603895','gfvfv',0,NULL,'2025-06-25 08:22:19',1,NULL),(13,'https://Horbax.o18.link/c?o=21313574&m=20733&a=603895','gfvfvd',0,NULL,'2025-06-25 08:22:19',1,NULL),(17,'https://Horbax.o18.link/c?o=21313574&m=20733&a=603895','aayush',2,2,'2025-06-25 08:24:35',1,NULL),(18,'https://youtu.be/EaG3Zd04W5s','P_CBghd',2,2,'2025-06-25 08:43:21',1,NULL),(19,'https://youtu.be/bcswG3Xlhfc','VGSbIaM',2,2,'2025-06-25 08:59:54',1,NULL),(20,'https://Horbax.o18.link/c?o=21313574&m=20733&a=603895','youtube',17,2,'2025-06-25 09:04:49',1,NULL),(21,'https://www.youtube.com','youtubed',4,2,'2025-06-25 09:32:28',1,NULL),(22,'https://www.youtube.com','youtubeddc',2,2,'2025-06-25 09:34:06',1,NULL),(23,'https://youtu.be/p4UBEIt3Rhg','ashud',6,2,'2025-06-25 09:36:32',1,NULL),(24,'https://youtu.be/p4UBEIt3Rhg','ashuddc',7,2,'2025-06-25 09:40:16',1,NULL),(25,'https://youtu.be/p4UBEIt3Rhg','latest',4,2,'2025-06-25 09:45:09',1,NULL),(26,'https://chat.deepseek.com/a/chat/s/3f4fe15d-526a-4633-af5f-124814683537','2XKDMwK',0,2,'2025-06-25 12:16:08',1,NULL),(27,'https://offers-hub.co/Affiliate/c?o=121&a=1','4K-MBSF',0,2,'2025-06-25 12:20:30',1,NULL),(28,'https://offers-hub.co/Affiliate/c?o=121&a=1','E0oV2LW',0,2,'2025-06-25 12:20:35',1,NULL),(29,'https://offers-hub.co/Affiliate/c?o=121&a=1','fvc',0,2,'2025-06-25 12:20:57',1,NULL),(31,'https://Horbax.o18.link/c?o=21313574&m=20733&a=603895','xc',0,2,'2025-06-25 12:22:05',1,NULL),(32,'https://offers-hub.co/Affiliate/c?o=121&a=1','1NJbfSt',0,2,'2025-06-25 12:25:02',1,NULL),(33,'https://offers-hub.co/Affiliate/c?o=121&a=1','PSD1ehq',12,2,'2025-06-25 12:27:14',1,NULL),(34,'https://offers-hub.co/Affiliate/c?o=121&a=1','toIErfE',20,2,'2025-06-25 12:27:18',1,NULL),(36,'https://youtu.be/jsZENkpNFK4','paidInternship',22,2,'2025-06-25 12:28:22',1,NULL),(38,'https://youtu.be/jsZENkpNFK4','e95jQ1R',4,2,'2025-06-25 12:32:14',1,NULL),(39,'uQKlqgo','https://chatgpt.com/c/685cf04a-cb58-800d-adbc-cabdf214060b',0,NULL,'2025-06-26 07:43:53',1,NULL),(40,'https://chatgpt.com/c/685cf04a-cb58-800d-adbc-cabdf214060b','g-1_pZb',2,NULL,'2025-06-26 07:45:01',1,NULL),(41,'https://chatgpt.com/c/685cf04a-cb58-800d-adbc-cabdf214060b','EG-HGte',2,NULL,'2025-06-26 07:45:21',1,NULL),(42,'https://www.youtube.com/shorts/V-8CKrjmL58?feature=share','3ogi3LQ',8,NULL,'2025-06-26 07:45:58',1,NULL),(43,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','juw-NDQ',2,NULL,'2025-06-26 07:50:59',1,NULL),(44,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','ashuraj',16,2,'2025-06-26 07:52:03',1,NULL),(45,'https://youtu.be/j9R3q6_khHo','EdOt4K0',2,NULL,'2025-06-26 16:23:46',1,NULL),(46,'https://youtu.be/f7ndZ-t9NPg','Gfr74pe',2,NULL,'2025-06-27 04:16:07',1,NULL),(47,'https://gamma.app/ai-powerpoint','cYmMaq7',2,NULL,'2025-06-27 07:53:06',1,NULL),(53,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','youtube',4,2,'2025-07-01 07:46:32',1,NULL),(54,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','youtube',4,2,'2025-07-01 07:46:38',1,NULL),(55,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','youtube',4,2,'2025-07-01 07:47:05',1,NULL),(61,'https://chatgpt.com/','chat',4,13,'2025-07-01 09:26:57',1,NULL),(62,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','s',2,13,'2025-07-01 09:27:52',1,NULL),(63,'https://bitly.cx/','FcDVf_J',2,13,'2025-07-01 09:29:02',1,NULL),(64,'https://youtu.be/2C8zYFArnKY','C4GJpOJ',1,15,'2025-07-01 12:54:08',1,NULL),(65,'https://youtube.com','YfcypMW',1,NULL,'2025-07-01 12:58:48',1,NULL),(66,'https://youtube.com','yrEjil3',0,NULL,'2025-07-02 06:55:33',1,NULL),(67,'https://chatgpt.com/c/6864d92d-5d9c-800d-8e22-5157a60fe7a5','2lVa0pS',0,NULL,'2025-07-02 07:47:50',1,NULL),(68,'https://chatgpt.com/c/6864d92d-5d9c-800d-8e22-5157a60fe7a5','XSdfIRJ',0,NULL,'2025-07-02 08:19:44',1,NULL),(69,'https://www.youtube.com/shorts/StIcsHaUXDc?feature=share','dc',0,NULL,'2025-07-02 09:03:50',1,NULL),(70,'http://localhost:5000/api/subscription/payment-status?payment_id=pay_QoC3ayx53UzvjM','0Cw6Rz8',1,NULL,'2025-07-02 12:19:05',1,NULL),(71,'https://www.reddit.com/r/saltierthankrayt/comments/1f7af7w/rare_youtube_w/','nH3lOG0',2,29,'2025-07-02 12:34:16',1,NULL),(72,'https://playkaro365.com/','GqrWk8o',2,29,'2025-07-02 12:34:54',1,NULL),(73,'https://www.youtube.com/feed/subscriptions/UCN1mK-_wHOn_TQGsMP5h8Lw','eCA2Y3c',0,29,'2025-07-03 09:23:04',1,NULL),(74,'https://www.youtube.com/watch?v=2wiM3Rgj2MA','yNxjbFI',0,29,'2025-07-03 09:23:17',1,NULL),(75,'https://www.youtube.com/watch?v=7o36UqYt6n8','TBvaCR6',0,29,'2025-07-03 09:23:27',1,NULL),(76,'https://www.youtube.com/watch?v=TUuuwOLkjbs','N2gdseP',1,29,'2025-07-03 09:23:35',1,NULL),(77,'https://chatgpt.com/c/68665bda-55ec-800d-806b-63932db8c08e','Rn1Rywb',1,NULL,'2025-07-03 11:57:19',1,NULL),(78,'https://imgs.search.brave.com/zUvNtRbW3oer5IA8f3Q6KvmHBJn9ZYhJ7x9qyRdZp48/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvOTg4/OTQwMDI4L2ZyL3Bo/b3RvL2ltZ2EwMzk1/LWpwZy5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9Tk5JWDBy/WGV2Y2Y1cElBZjlw/Q29DTE91V1lXNkli/a3QwYkJXVGpCYkRK/cz0','92DvN9r',2,NULL,'2025-07-03 11:58:48',1,NULL),(79,'https://client.googiehost.com/clientarea.php?action=productdetails&id=369059','RMmuu_P',1,32,'2025-08-21 15:49:44',1,NULL),(80,'https://github.com/Aayushr300/salonfrontend','MX6spGE',1,NULL,'2025-09-25 17:14:51',1,NULL),(81,'https://chat.deepseek.com/a/chat/s/ca41d58f-8e8f-4809-a6d6-2fed111d63d1','yG__GcQ',0,NULL,'2025-09-25 17:22:01',1,NULL),(82,'https://web.whatsapp.com/','4Xu2rAy',1,34,'2025-10-10 16:16:57',1,NULL);
/*!40000 ALTER TABLE `short_urls` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `static_pages`
--

DROP TABLE IF EXISTS `static_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `static_pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `page_key` enum('privacy','refund','terms') NOT NULL,
  `title` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_key` (`page_key`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `static_pages`
--

LOCK TABLES `static_pages` WRITE;
/*!40000 ALTER TABLE `static_pages` DISABLE KEYS */;
INSERT INTO `static_pages` VALUES (1,'privacy','Privacy Policy – How Shortify Protects Your Data','<p>At <strong>Shortify</strong>, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our URL shortening services.</p><h3>1. Information We Collect</h3><p>We collect the following types of information:</p><ul><li><strong>Shortened URLs</strong>: When you use our service to shorten a URL, we store the original and shortened versions.</li><li><strong>Click Data</strong>: We may track data such as IP address, browser type, location (approximate), and timestamp when someone clicks on a shortened URL.</li><li><strong>Account Information</strong> (if applicable): If you register or sign in, we may collect your email address and password (stored securely).</li><li><strong>Logs</strong>: Server logs may capture IP addresses and request details for security and analytics purposes.</li></ul><h3>2. How We Use Your Information</h3><p>We use collected information to:</p><ul><li>Provide and improve our URL shortening service.</li><li>Monitor and prevent abuse or malicious activity.</li><li>Analyze usage trends and performance.</li><li>Respond to legal requests or comply with applicable laws.</li></ul><h3>3. Cookies &amp; Tracking Technologies</h3><p>We may use cookies and similar technologies to:</p><ul><li>Maintain user sessions.</li><li>Track usage patterns.</li><li>Improve your experience on our site.</li></ul><p>You can disable cookies in your browser settings, but some features may not work properly.</p><h3>4. Sharing of Information</h3><p>We <strong>do not sell or rent</strong> your personal information to third parties. However, we may share data in the following cases:</p><ul><li>To comply with legal obligations.</li><li>To prevent fraud or abuse of our services.</li><li>With trusted third-party service providers who assist us (e.g., analytics, hosting) under confidentiality agreements.</li></ul><h3>5. Data Security</h3><p>We take reasonable steps to protect your data, including:</p><ul><li>Encryption of sensitive information.</li><li>Secure server infrastructure.</li><li>Access controls and monitoring.</li></ul><p>However, no method of transmission or storage is 100% secure.</p><h3>6. Data Retention</h3><p>We retain data as long as necessary for:</p><ul><li>Providing the service.</li><li>Legal and regulatory compliance.</li><li>Legitimate business interests.</li></ul><p>You may request deletion of your data at any time (see below).</p><h3>7. Your Rights</h3><p>You may have the right to</p><ul><li>Access, update, or delete your personal information.</li><li>Object to data processing under certain circumstances.</li><li>Request data portability (where applicable).</li></ul><p>To exercise these rights, contact us at: [support@shortify.com]</p><h3>8. Third-Party Links</h3><p>Our service may contain links to third-party websites. We are not responsible for the privacy practices of those sites.</p><h3>9. Children’s Privacy</h3><p>Our service is not intended for children under the age of 13. We do not knowingly collect personal data from children.</p><h3>10. Changes to This Policy</h3><p>We may update this policy from time to time. Any changes will be posted here with an updated \"Effective Date\".</p><h3>11. Contact Us</h3><p>If you have questions or concerns about this policy, contact us at:</p><p>📧 <strong>Email</strong>: support@shortify.com<br>🌐 <strong>Website</strong>: <a href=\"https://www.shortify.com\">www.shortify.com</a></p>','2025-07-02 07:53:48'),(2,'refund','💸 Refund Policy for Shortify','<p><strong>Effective Date: July 2, 2025</strong></p><p>At <strong>Shortify</strong>, we strive to provide a reliable and user-friendly URL shortening experience. If you are not entirely satisfied with a paid service, we’re here to help.</p><h3>1. Refund Eligibility</h3><p>We offer refunds under the following conditions:</p><ul><li><strong>Technical Failure</strong>: If our system fails to deliver the shortened link functionality due to a verified issue on our end.</li><li><strong>Duplicate Payment</strong>: If you are charged more than once for the same service.</li><li><strong>Service Not Delivered</strong>: If you paid for a premium feature that was not activated or delivered as promised.</li></ul><blockquote><p>❌ <strong>We do not offer refunds for:</strong></p><ul><li>Accidental purchases</li><li>Misuse of service</li><li>Links removed for violating our terms</li></ul></blockquote><h3>2. Refund Process</h3><p>To request a refund, please email <strong>support@shortify.com</strong> with:</p><ul><li>Your full name</li><li>Email address used</li><li>Transaction ID or payment proof</li><li>Reason for the refund request</li></ul><h3>3. Time Frame</h3><p>Refund requests must be submitted within <strong>7 days</strong> of the original purchase. Approved refunds will be processed within <strong>5–10 business days</strong>, back to the original payment method.</p><h3>4. Chargebacks</h3><p>We recommend contacting us before initiating a chargeback with your payment provider. Unresolved chargebacks may result in account suspension.</p><h3>5. Contact Us</h3><p>📧 <strong>Email</strong>: support@shortify.com<br>🌐 <strong>Website</strong>: <a href=\"https://www.shortify.com\">www.shortify.com</a></p>','2025-07-02 07:24:40'),(3,'terms','📜 Terms and Conditions for Shortify','<p><strong>Effective Date: July 2, 2025</strong></p><p>Welcome to <strong>Shortify</strong>. By accessing or using our services, you agree to be bound by these Terms and Conditions.</p><h3>1. Use of Service</h3><ul><li>You may use Shortify to shorten and share links.</li><li>You agree not to use the service for spam, phishing, malware, or any illegal activity.</li><li>Links that violate our policies may be removed without notice.</li></ul><h3>2. Account</h3><ul><li>Users may optionally create an account.</li><li>You are responsible for maintaining the security of your account credentials.</li></ul><h3>3. Restrictions</h3><p>You must <strong>not</strong>:</p><ul><li>Shorten URLs that redirect to harmful or deceptive content.</li><li>Use bots or automated tools to generate links.</li><li>Tamper with analytics or click data.</li></ul><h3>4. Intellectual Property</h3><p>All content, branding, and code provided by Shortify are owned or licensed by us. You may not reuse or reproduce any part of our platform without permission.</p><h3>5. Termination</h3><p>We reserve the right to suspend or terminate accounts or links that violate these terms or harm the service or others.</p><h3>6. Limitation of Liability</h3><p>Shortify is provided “as is.” We are not responsible for:</p><ul><li>Lost data or links</li><li>Downtime or disruptions</li><li>Damages arising from use or misuse of our service</li></ul><h3>7. Changes to Terms</h3><p>We may update these Terms and Conditions at any time. Continued use of the service means you accept any changes.</p><h3>8. Contact Us</h3><p>📧 <strong>Email</strong>: support@shortify.com<br>🌐 <strong>Website</strong>: <a href=\"https://www.shortify.com\">www.shortify.com</a></p>','2025-07-02 07:31:05');
/*!40000 ALTER TABLE `static_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_plans`
--

DROP TABLE IF EXISTS `subscription_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT '0.00',
  `features` text,
  `duration_months` int DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_plans`
--

LOCK TABLES `subscription_plans` WRITE;
/*!40000 ALTER TABLE `subscription_plans` DISABLE KEYS */;
INSERT INTO `subscription_plans` VALUES (1,'Basic Plan',199.00,'Create Unlimited Urls\nCreate Good',1,1,'2025-10-10 22:18:02','2025-10-10 22:18:02');
/*!40000 ALTER TABLE `subscription_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptions`
--

DROP TABLE IF EXISTS `subscriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscriptions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `plan` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `plan_id` int DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptions`
--

LOCK TABLES `subscriptions` WRITE;
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` VALUES (1,2,'Basic Plans',1,'2025-06-28','2025-07-28',3,149.00),(2,9,'Premium Plans',1,'2025-06-28','2025-07-28',5,299.00),(3,11,'Basic Plans',1,'2025-06-30','2025-07-30',3,149.00),(4,12,'Basic Plans',1,'2025-07-01','2025-08-01',3,149.00),(5,2,'Basic Plans',1,'2025-07-01','2025-08-01',3,149.00),(6,13,'Basic Plans',1,'2025-07-01','2025-08-01',3,149.00),(7,15,'Basic Plans',1,'2025-07-01','2025-08-01',3,149.00),(8,16,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(9,18,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(10,19,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(11,20,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(12,21,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(13,22,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(14,23,'Basic',1,'2025-07-02','2025-08-02',6,1.00),(15,24,'Basic',1,'2025-07-02','2025-08-02',6,1.00),(16,25,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(17,26,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00),(18,27,'Basic',1,'2025-07-02','2025-08-02',6,1.00),(19,28,'Basic',1,'2025-07-02','2025-08-02',6,1.00),(20,29,'Basic Plans',1,'2025-07-02','2025-08-02',3,149.00);
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(2083) DEFAULT 'https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `subscription_active` int DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Amit Kumar','amit@gmail.com','$2b$10$cl5YVvC/pZ8rsXSs65JyQ.8mFujIb/K3tOLP3tls0DRBekpp3VA6i','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-06-28 14:10:07',1),(9,'Kundan Kumar','kundan@gmail.com','$2b$10$Mt7b4K2Rn1nITU19Likls.vnjeY6w/27RHzBuf5o1NqlJXmqOKHg.','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-06-28 17:19:26',0),(10,'Aryan','aryan@gmail.com','$2b$10$a.DMyDADVDTO3pgH0kBSPeQ0azBVRSMWJXQpy9LFRrdGUsnkXAw1K','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-06-29 23:26:40',0),(11,'Animesh','animesh@gmail.com','$2b$10$lkhIPRxVGBfDzcDxOoPyD.wd7ETsV8ql./8XEnQHA4U/x.yJQozeG','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-06-30 20:55:57',0),(12,'Raja','raja@gmail.com','$2b$10$mCAmU8z21KfTSFntKLdMKewrN30VQmiLwd38ydTG2hS54vfVOl08O','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-01 12:34:49',1),(13,'Amresh','amresh@gmail.com','$2b$10$ShayYSToRXy2iV5ZZuIYT.j25GgE7GImQTzSlZ6L.iz/..AX.85Fq','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-01 13:10:01',1),(14,'ashu','ashu@gmail.com','$2b$10$Z3qdGdF62oVMhkpr6mvdvevIcu/ExcE0ORp7QDDx1z9lFIIixiyOK','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-01 13:33:15',0),(15,'hudek','hh@gmail.com','$2b$10$bMFiEfgfkwzMFfIcLU3Os.eNmCe0k.n7jdezDXeq4LTPmoPG.6cTG','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-01 18:23:29',1),(16,'Rajesh','rajesh@gmail.com','$2b$10$AaeWo4l147/MeYgCnPKSduGguXuotXive.p9jflkS31LRpLNJmjmW','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-02 14:02:12',1),(24,'sxa','ankit12@gmail.com','$2b$10$d3kA28SLaiuDytpHt6ZGnuieBgUban2Xk41SeK8/AIsmy9.JWvK3.','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-02 17:11:20',1),(29,'Aayush raj','aayushr300@gmail.com','$2b$10$jGvGQ3Z7ktUS5MJ9CSUZyum5Gox3dhYHSaomdpOWEt0/7YvGCCtHy','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-02 17:45:14',1),(30,'Aayush raj','Rajahsj@gmail.com','$2b$10$bI1z2pkNC1Ymer1CibfHCO0SB85vNkkraOOPxVGwJJgsZ/wovjHka','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-03 17:00:48',0),(31,'Raja Khana','raj@gmail.com','$2b$10$5BX02PS/Phociwx.ox2JmejZeRkMipwZq9DLZBxhs9KinAr9vvPn.','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-03 17:48:16',0),(32,'Aayush Raj','admin@gmail.com','$2b$10$hCzGkC.hNa0Elt25zJor0.aOBVICOp3gCz13ogOiYFpN28b675.L6','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-07-06 09:42:57',0),(33,'New Aayush Raj','aayushr30450@gmail.com','$2b$10$Uv6Fo4o0jv/yEyYyWUNszOICJeyBrsaq2CfpW2qm62TG5FXOUh8Xq','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-09-25 23:02:49',0),(34,'Aayush Raj','offers.hubs@gmail.com','$2b$10$97rf59ByNozCHPpgaVL2PeDUqdR0KFz6sKmNOwQMlhq6L6vXj7vvy','https://gravatar.com/avatar/27205e5c51cb03f862138b22bcb5dc20f94a342e744ff6df1b8dc8af3c865109.jpg','2025-10-10 21:44:36',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-11 14:29:39
