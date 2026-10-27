CREATE TABLE `audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`at` text NOT NULL,
	`actor_email` text NOT NULL,
	`actor_name` text DEFAULT '' NOT NULL,
	`action` text NOT NULL,
	`target` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `audit_at` ON `audit_log` (`at`);--> statement-breakpoint
ALTER TABLE `resources` ADD `archived_at` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_resource` ON `users` (`resource_id`);