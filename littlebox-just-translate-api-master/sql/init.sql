CREATE SCHEMA `kic_garden` DEFAULT CHARACTER SET utf8mb4 ;

CREATE TABLE `kic_garden`.`t_hot_news` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sort_index` INT NOT NULL DEFAULT 0,
  `img_url` VARCHAR(500) NULL,
  `is_delete` INT NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NULL DEFAULT NOW(),
  PRIMARY KEY (`id`));

CREATE TABLE `kic_garden`.`t_translation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `language` VARCHAR(45) NULL,
  `relevant_id` INT NULL,
  `relevant_type` VARCHAR(45) NULL,
  `relevant_key` VARCHAR(45) NULL,
  `content` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  `updated_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY (`id`));
