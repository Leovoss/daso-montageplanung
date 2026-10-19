CREATE TABLE `day_entries` (
	`resource_id` text NOT NULL,
	`day` text NOT NULL,
	`data` text NOT NULL,
	PRIMARY KEY(`resource_id`, `day`),
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action
);
