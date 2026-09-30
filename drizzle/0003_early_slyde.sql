PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_assignments` (
	`id` text PRIMARY KEY NOT NULL,
	`resource_id` text NOT NULL,
	`project_id` text,
	`day` text NOT NULL,
	`assignment_type` text DEFAULT 'project' NOT NULL,
	`employee_day` text,
	`count` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_assignments`("id", "resource_id", "project_id", "day", "assignment_type", "employee_day", "count") SELECT "id", "resource_id", "project_id", "day", "assignment_type", "employee_day", "count" FROM `assignments`;--> statement-breakpoint
DROP TABLE `assignments`;--> statement-breakpoint
ALTER TABLE `__new_assignments` RENAME TO `assignments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `assignment_resource_project_day` ON `assignments` (`resource_id`,`project_id`,`day`);--> statement-breakpoint
CREATE INDEX `assignment_day` ON `assignments` (`day`);--> statement-breakpoint
CREATE UNIQUE INDEX `one_employee_per_day` ON `assignments` (`resource_id`,`employee_day`);