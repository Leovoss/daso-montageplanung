ALTER TABLE `projects` ADD `sort_order` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `archived_at` text;
--> statement-breakpoint
UPDATE `projects` SET `sort_order` = -rowid;
