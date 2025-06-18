"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddResetToken1747988956268 = void 0;
const typeorm_1 = require("typeorm");
class AddResetToken1747988956268 {
    async up(queryRunner) {
        await queryRunner.addColumn("user", new typeorm_1.TableColumn({
            name: "email",
            type: "varchar",
            length: "255",
            isNullable: true, // ← si tu veux que ce champ soit facultatif
        }));
        await queryRunner.addColumn("user", new typeorm_1.TableColumn({
            name: "resetToken",
            type: "text",
            isNullable: true,
        }));
        await queryRunner.addColumn("user", new typeorm_1.TableColumn({
            name: "resetTokenExpiration",
            type: "timestamp",
            isNullable: true,
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("user", "resetTokenExpiration");
        await queryRunner.dropColumn("user", "resetToken");
        await queryRunner.dropColumn("user", "email");
    }
}
exports.AddResetToken1747988956268 = AddResetToken1747988956268;
