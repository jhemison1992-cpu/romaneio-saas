CREATE TABLE `deliveryTerms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inspectionId` int NOT NULL,
	`userId` int NOT NULL,
	`companyId` int,
	`protocolNumber` varchar(50) NOT NULL,
	`completionDate` timestamp NOT NULL,
	`responsibleTechnician` varchar(255) NOT NULL,
	`description` text,
	`digitalSignature` text,
	`pdfUrl` text,
	`status` enum('draft','signed','archived') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `deliveryTerms_id` PRIMARY KEY(`id`),
	CONSTRAINT `deliveryTerms_protocolNumber_unique` UNIQUE(`protocolNumber`)
);
