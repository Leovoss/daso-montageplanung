ALTER TABLE `assignments` ADD `employee_day` text;--> statement-breakpoint
CREATE UNIQUE INDEX `one_employee_per_day` ON `assignments` (`resource_id`,`employee_day`);