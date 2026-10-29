CREATE TABLE `vacation_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`resource_id` text NOT NULL,
	`start_day` text NOT NULL,
	`end_day` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`decided_at` text,
	`decided_by` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `vacation_status` ON `vacation_requests` (`status`);--> statement-breakpoint
CREATE INDEX `vacation_resource` ON `vacation_requests` (`resource_id`);