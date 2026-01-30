ALTER TABLE `users` ADD `preferredTemplate` enum('blank','aluminc') DEFAULT 'blank';--> statement-breakpoint
ALTER TABLE `users` DROP COLUMN `subscriptionPlanId`;