import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMigration1673827317413 implements MigrationInterface {
    name = 'CreateMigration1673827317413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_9dbf61b2d00d2c77d3b5ced37c\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`filme\` (\`id\` int NOT NULL AUTO_INCREMENT, \`titulo\` varchar(255) NOT NULL, \`linkImagem\` varchar(1000) NOT NULL, \`descricao\` varchar(10000) NOT NULL, \`tempoDeFilme\` int NOT NULL, \`classificacao\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_5e00a408065cee0752136df10e\` (\`titulo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sala\` (\`id\` int NOT NULL AUTO_INCREMENT, \`status\` varchar(255) NOT NULL DEFAULT 'Sem Atividade no Momento', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`sessao\` (\`id\` int NOT NULL AUTO_INCREMENT, \`init\` datetime NOT NULL, \`finish\` datetime NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Aguardando', \`salaId\` int NULL, \`filmeId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`filmeTags\` (\`filmeId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_74952f81b9a8e07911684589ea\` (\`filmeId\`), INDEX \`IDX_50a479977046baa3cb2dd290e9\` (\`tagId\`), PRIMARY KEY (\`filmeId\`, \`tagId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`sessao\` ADD CONSTRAINT \`FK_f279b7dc8e5cf8cf6ad5c2937d2\` FOREIGN KEY (\`salaId\`) REFERENCES \`sala\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`sessao\` ADD CONSTRAINT \`FK_0e875114a258aa2ad7de82140a3\` FOREIGN KEY (\`filmeId\`) REFERENCES \`filme\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filmeTags\` ADD CONSTRAINT \`FK_74952f81b9a8e07911684589eab\` FOREIGN KEY (\`filmeId\`) REFERENCES \`filme\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`filmeTags\` ADD CONSTRAINT \`FK_50a479977046baa3cb2dd290e9c\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`filmeTags\` DROP FOREIGN KEY \`FK_50a479977046baa3cb2dd290e9c\``);
        await queryRunner.query(`ALTER TABLE \`filmeTags\` DROP FOREIGN KEY \`FK_74952f81b9a8e07911684589eab\``);
        await queryRunner.query(`ALTER TABLE \`sessao\` DROP FOREIGN KEY \`FK_0e875114a258aa2ad7de82140a3\``);
        await queryRunner.query(`ALTER TABLE \`sessao\` DROP FOREIGN KEY \`FK_f279b7dc8e5cf8cf6ad5c2937d2\``);
        await queryRunner.query(`DROP INDEX \`IDX_50a479977046baa3cb2dd290e9\` ON \`filmeTags\``);
        await queryRunner.query(`DROP INDEX \`IDX_74952f81b9a8e07911684589ea\` ON \`filmeTags\``);
        await queryRunner.query(`DROP TABLE \`filmeTags\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`sessao\``);
        await queryRunner.query(`DROP TABLE \`sala\``);
        await queryRunner.query(`DROP INDEX \`IDX_5e00a408065cee0752136df10e\` ON \`filme\``);
        await queryRunner.query(`DROP TABLE \`filme\``);
        await queryRunner.query(`DROP INDEX \`IDX_9dbf61b2d00d2c77d3b5ced37c\` ON \`tag\``);
        await queryRunner.query(`DROP TABLE \`tag\``);
    }

}
