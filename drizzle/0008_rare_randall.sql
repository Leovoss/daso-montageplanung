PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_punches` (
	`id` text PRIMARY KEY NOT NULL,
	`resource_id` text NOT NULL,
	`project_id` text,
	`started` text NOT NULL,
	`ended` text,
	`pause` integer,
	`start_location` text NOT NULL,
	`end_location` text,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_punches`("id", "resource_id", "project_id", "started", "ended", "pause", "start_location", "end_location") SELECT "id", "resource_id", "project_id", "started", "ended", "pause", "start_location", "end_location" FROM `punches`;--> statement-breakpoint
DROP TABLE `punches`;--> statement-breakpoint
ALTER TABLE `__new_punches` RENAME TO `punches`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `one_open_punch` ON `punches` (`resource_id`) WHERE "punches"."ended" IS NULL;