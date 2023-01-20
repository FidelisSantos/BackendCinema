import { MigrationInterface, QueryRunner } from "typeorm";

export class update1674242171336 implements MigrationInterface {
    name = 'update1674242171336'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_9dbf61b2d00d2c77d3b5ced37c\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(255) NOT NULL, \`linkImagem\` varchar(1000) NOT NULL, \`descricao\` varchar(10000) NOT NULL, \`tempoDeFilme\` int NOT NULL, \`classificacao\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_b074a1170a4776cee7c4fc0c57\` (\`titulo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL DEFAULT 'Sem Atividade no Momento', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sessao\` (\`id\` int NOT NULL AUTO_INCREMENT, \`init\` datetime NOT NULL, \`finish\` datetime NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Aguardando', \`salaId\` int NULL, \`movieId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`filmeTags\` (\`movieId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_75d8775b2dcdfe3bf90dd5fe2e\` (\`movieId\`), INDEX \`IDX_50a479977046baa3cb2dd290e9\` (\`tagId\`), PRIMARY KEY (\`movieId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sessao\` ADD CONSTRAINT \`FK_f279b7dc8e5cf8cf6ad5c2937d2\` FOREIGN KEY (\`salaId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sessao\` ADD CONSTRAINT \`FK_ccd11c3ab7e6616ed1eed997cf2\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filmeTags\` ADD CONSTRAINT \`FK_75d8775b2dcdfe3bf90dd5fe2e4\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`filmeTags\` ADD CONSTRAINT \`FK_50a479977046baa3cb2dd290e9c\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`filmeTags\` DROP FOREIGN KEY \`FK_50a479977046baa3cb2dd290e9c\``);
        await queryRunner.query(`ALTER TABLE \`filmeTags\` DROP FOREIGN KEY \`FK_75d8775b2dcdfe3bf90dd5fe2e4\``);
        await queryRunner.query(`ALTER TABLE \`sessao\` DROP FOREIGN KEY \`FK_ccd11c3ab7e6616ed1eed997cf2\``);
        await queryRunner.query(`ALTER TABLE \`sessao\` DROP FOREIGN KEY \`FK_f279b7dc8e5cf8cf6ad5c2937d2\``);
        await queryRunner.query(`DROP INDEX \`IDX_50a479977046baa3cb2dd290e9\` ON \`filmeTags\``);
        await queryRunner.query(`DROP INDEX \`IDX_75d8775b2dcdfe3bf90dd5fe2e\` ON \`filmeTags\``);
        await queryRunner.query(`DROP TABLE \`filmeTags\``);
        await queryRunner.query(`DROP TABLE \`sessao\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`room\``);
        await queryRunner.query(`DROP INDEX \`IDX_b074a1170a4776cee7c4fc0c57\` ON \`movie\``);
        await queryRunner.query(`DROP TABLE \`movie\``);
        await queryRunner.query(`DROP INDEX \`IDX_9dbf61b2d00d2c77d3b5ced37c\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
