-- MySQL dump 10.15  Distrib 10.0.34-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: noticeboard
-- ------------------------------------------------------
-- Server version	10.0.34-MariaDB

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
-- Current Database: `noticeboard`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `noticeboard` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;

USE `noticeboard`;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `hash_pass` varchar(255) DEFAULT NULL,
  `plain` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `admin_admin_id_uindex` (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'SantosReo','ronireiosantos@gmail.com','0779104144','e1878dd6863997c6b1e41c9673f21998','santos');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `courses` (
  `course_id` int(11) NOT NULL AUTO_INCREMENT,
  `course_code` varchar(255) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `programme_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  UNIQUE KEY `courses_course_d_uindex` (`course_id`),
  KEY `courses_programmes_programme_id_fk` (`programme_id_fk`),
  CONSTRAINT `courses_programmes_programme_id_fk` FOREIGN KEY (`programme_id_fk`) REFERENCES `programmes` (`programme_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,'BSE 4201','Research Methodology',1),(2,'BIT 4300','Information Systems',3),(3,'BSE 2201','Operating syatems',1);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `departments` (
  `department_id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(255) DEFAULT NULL,
  `department_head` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `departments_department_id_uindex` (`department_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Networks','Oh Lord God'),(3,'Computer Systems','Nsabagwa');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events_upshots`
--

DROP TABLE IF EXISTS `events_upshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `events_upshots` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `event_title` varchar(255) DEFAULT NULL,
  `event_subtitle` text,
  `description` text,
  `event_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `file_name` varchar(255) DEFAULT NULL,
  `posted_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`event_id`),
  UNIQUE KEY `events_upshots_event_id_uindex` (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events_upshots`
--

LOCK TABLES `events_upshots` WRITE;
/*!40000 ALTER TABLE `events_upshots` DISABLE KEYS */;
INSERT INTO `events_upshots` VALUES (1,'Testingevents','Test','ma HIHIH IT works\ndude','2018-03-26 08:29:22','2018-03-25 21:57:44','Test_2018_03-26_00_57:44.jpg','Sekito santos'),(2,'fool','Another Test','anothermoney test','2018-03-29 08:29:18','2018-03-25 21:58:29','Another_Test_2018_03-26_00_58:29.jpg','Sekito santos'),(3,'date test','DATES','does it work','2018-03-29 21:00:00','2018-03-26 19:54:37','','Sekito Ronald'),(4,'musical','Event 2','saen','2018-04-10 21:00:00','2018-04-01 06:59:41','','SantosReo'),(5,'anoer','test new','To happen soon','2018-04-22 21:00:00','2018-04-21 20:09:40','','SantosReo'),(6,'football','soccer','comewith shoes','2018-04-29 21:00:00','2018-04-23 15:13:41','','Sekito Ronald');
/*!40000 ALTER TABLE `events_upshots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lecturers`
--

DROP TABLE IF EXISTS `lecturers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lecturers` (
  `lecturer_id` int(11) NOT NULL AUTO_INCREMENT,
  `lecturer_email` varchar(255) DEFAULT NULL,
  `lecturer_contact` varchar(13) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `lecturer_office_id_fk` int(11) DEFAULT NULL,
  `department_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`lecturer_id`),
  UNIQUE KEY `lecturers_lecturer_id_uindex` (`lecturer_id`),
  KEY `lecturers_rooms_room_id_fk` (`lecturer_office_id_fk`),
  KEY `lecturers_departments_department_id_fk` (`department_id_fk`),
  CONSTRAINT `lecturers_departments_department_id_fk` FOREIGN KEY (`department_id_fk`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `lecturers_rooms_room_id_fk` FOREIGN KEY (`lecturer_office_id_fk`) REFERENCES `rooms` (`room_id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lecturers`
--

LOCK TABLES `lecturers` WRITE;
/*!40000 ALTER TABLE `lecturers` DISABLE KEYS */;
INSERT INTO `lecturers` VALUES (1,'reiosantos@yahoo.com','santos','Sekito','Ronald',1,3),(3,'asher@ash.ms','123456789','Ashraf','Kaguta',2,1);
/*!40000 ALTER TABLE `lecturers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notices`
--

DROP TABLE IF EXISTS `notices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notices` (
  `notice_id` int(11) NOT NULL AUTO_INCREMENT,
  `notice_title` varchar(255) DEFAULT NULL,
  `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `description` text,
  `posted_by` varchar(255) DEFAULT NULL,
  `programme_id_fk` int(11) DEFAULT NULL,
  `level` varchar(15) DEFAULT NULL,
  `category` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`notice_id`),
  UNIQUE KEY `notices_notice_id_uindex` (`notice_id`),
  UNIQUE KEY `notices_notice_id_uindex_2` (`notice_id`),
  KEY `notices_programmes_programme_id_fk` (`programme_id_fk`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notices`
--

LOCK TABLES `notices` WRITE;
/*!40000 ALTER TABLE `notices` DISABLE KEYS */;
INSERT INTO `notices` VALUES (5,'Testing Note','2018-03-26 18:54:59','i have nothing to write here.. YOU FOOL','SantosReo',1,'normal',NULL),(6,'test2','2018-04-01 06:57:27','idiot','SantosReo',5,'normal',NULL),(7,'Leve Test','2018-04-01 10:36:39','urgence level','Ronald Santos',1,'urgent',NULL),(8,'test','2018-04-21 14:32:43','test','SantosReo',1,'urgent','entertainment'),(9,'Again','2018-04-21 20:31:07','haha testing palaroid','SantosReo',2,'urgent','educational'),(10,'lost id','2018-04-23 15:18:36','pliz i lostmaid ','Sekito Ronald',1,'normal','educational');
/*!40000 ALTER TABLE `notices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programmes`
--

DROP TABLE IF EXISTS `programmes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `programmes` (
  `programme_id` int(11) NOT NULL AUTO_INCREMENT,
  `programme_name` text,
  `programme_code` varchar(255) DEFAULT NULL,
  `department_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`programme_id`),
  UNIQUE KEY `programmes_programme_id_uindex` (`programme_id`),
  KEY `programmes_departments_department_id_fk` (`department_id_fk`),
  CONSTRAINT `programmes_departments_department_id_fk` FOREIGN KEY (`department_id_fk`) REFERENCES `departments` (`department_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programmes`
--

LOCK TABLES `programmes` WRITE;
/*!40000 ALTER TABLE `programmes` DISABLE KEYS */;
INSERT INTO `programmes` VALUES (1,'Bachelor of Science in software Engineering','BSSE',1),(2,'Information Technology','BIT',1),(3,'Information Systems','BIS',3),(5,'archives and records','BRAM',1);
/*!40000 ALTER TABLE `programmes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rooms` (
  `room_id` int(11) NOT NULL AUTO_INCREMENT,
  `room_no` varchar(45) DEFAULT NULL,
  `room_level` varchar(255) DEFAULT NULL,
  `block_no` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`room_id`),
  UNIQUE KEY `rooms_room_id_uindex` (`room_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'320','3','A'),(2,'021','2','A32');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `students` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `registration_no` varchar(255) DEFAULT NULL,
  `student_name` varchar(255) DEFAULT NULL,
  `student_no` varchar(255) DEFAULT NULL,
  `programme_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `students_students_id_uindex` (`student_id`),
  KEY `students_courses_course_d_fk` (`programme_id_fk`),
  CONSTRAINT `students_courses_course_d_fk` FOREIGN KEY (`programme_id_fk`) REFERENCES `programmes` (`programme_id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'14/U/14824/EVE','Ronald Santos','214003604',1),(2,'14/U/7834/PS','Katum','213456780',3),(3,'14/U/23243','Zikusooka Samson','3213889028',2),(5,'14/U/14567/EVE','Kamukama Collins','214000987',1);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_tables`
--

DROP TABLE IF EXISTS `time_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `time_tables` (
  `time_table_id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) DEFAULT NULL,
  `semester` int(11) DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `post_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `programme_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`time_table_id`),
  UNIQUE KEY `time_tables_time_table_id_uindex` (`time_table_id`),
  KEY `time_tables_programmes_programme_id_fk` (`programme_id_fk`),
  CONSTRAINT `time_tables_programmes_programme_id_fk` FOREIGN KEY (`programme_id_fk`) REFERENCES `programmes` (`programme_id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_tables`
--

LOCK TABLES `time_tables` WRITE;
/*!40000 ALTER TABLE `time_tables` DISABLE KEYS */;
INSERT INTO `time_tables` VALUES (1,2017,2,'2017_2_2018_03-25_23_20:24.pdf','2018-03-25 20:20:24',1),(2,2018,1,'2018_1_2018_03-25_23_24:56.pdf','2018-03-25 20:24:56',2);
/*!40000 ALTER TABLE `time_tables` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-04-25 14:18:14
