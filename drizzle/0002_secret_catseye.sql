CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`customer_id` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`customer_id`) REFERENCES `customers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
ALTER TABLE `projects` ADD `customer_id` text REFERENCES customers(id);--> statement-breakpoint
ALTER TABLE `projects` ADD `foreman_id` text REFERENCES resources(id);--> statement-breakpoint
ALTER TABLE `projects` ADD `project_email` text;