CREATE TABLE `match_records` (
	`id` text PRIMARY KEY NOT NULL,
	`match_id` text NOT NULL,
	`sequence` integer NOT NULL,
	`set_number` integer DEFAULT 1 NOT NULL,
	`type` text NOT NULL,
	`server` text,
	`winner` text NOT NULL,
	`valid_second_serves` integer,
	`double_faults` integer,
	`points_lost` integer,
	`points_won` integer,
	`player_tie_break_points` integer,
	`opponent_tie_break_points` integer,
	`recorded_at` integer NOT NULL,
	`updated_at` integer,
	FOREIGN KEY (`match_id`) REFERENCES `matches`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `match_records_match_id_idx` ON `match_records` (`match_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `match_records_match_sequence_uq` ON `match_records` (`match_id`,`sequence`);--> statement-breakpoint
CREATE TABLE `matches` (
	`id` text PRIMARY KEY NOT NULL,
	`opponent_name` text NOT NULL,
	`first_server` text NOT NULL,
	`status` text NOT NULL,
	`started_at` integer NOT NULL,
	`finished_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `matches_status_idx` ON `matches` (`status`);--> statement-breakpoint
CREATE INDEX `matches_started_at_idx` ON `matches` (`started_at`);