import { TableColumn } from "typeorm";
import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddResetToken1747988956268 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "email",
				type: "varchar",
				length: "255",
				isNullable: true, // ← si tu veux que ce champ soit facultatif
			}),
		);

		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "resetToken",
				type: "text",
				isNullable: true,
			}),
		);

		await queryRunner.addColumn(
			"user",
			new TableColumn({
				name: "resetTokenExpiration",
				type: "timestamp",
				isNullable: true,
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropColumn("user", "resetTokenExpiration");
		await queryRunner.dropColumn("user", "resetToken");
		await queryRunner.dropColumn("user", "email");
	}
}
