ALTER TABLE `romaneios` ADD `responsavel` varchar(255);--> statement-breakpoint
ALTER TABLE `romaneios` ADD `tipoContrato` varchar(100);--> statement-breakpoint
ALTER TABLE `romaneios` ADD `contratante` text;--> statement-breakpoint
ALTER TABLE `romaneios` ADD `dataInicio` timestamp;--> statement-breakpoint
ALTER TABLE `romaneios` ADD `previsaoTermino` timestamp;--> statement-breakpoint
ALTER TABLE `romaneios` ADD `numeroContrato` varchar(50);--> statement-breakpoint
ALTER TABLE `romaneios` ADD `endereco` text;--> statement-breakpoint
ALTER TABLE `romaneios` ADD `valor` decimal(12,2);