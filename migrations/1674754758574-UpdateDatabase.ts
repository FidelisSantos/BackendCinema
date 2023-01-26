import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDatabase1674754758574 implements MigrationInterface {
  name = 'UpdateDatabase1674754758574';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tag\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_9dbf61b2d00d2c77d3b5ced37c\` (\`tag\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movie\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`imageLink\` varchar(1000) NOT NULL, \`description\` varchar(10000) NOT NULL, \`movieTime\` int NOT NULL, \`classification\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_a81090ad0ceb645f30f9399c34\` (\`title\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`room\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Sem Atividade no Momento', UNIQUE INDEX \`IDX_535c742a3606d2e3122f441b26\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`session\` (\`id\` int NOT NULL AUTO_INCREMENT, \`init\` datetime NOT NULL, \`finish\` datetime NOT NULL, \`status\` varchar(255) NOT NULL DEFAULT 'Aguardando', \`roomId\` int NULL, \`movieId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movieTags\` (\`movieId\` int NOT NULL, \`tagId\` int NOT NULL, INDEX \`IDX_d26a7ec914691b8293717d820d\` (\`movieId\`), INDEX \`IDX_4c980c686da573f4d7260b56aa\` (\`tagId\`), PRIMARY KEY (\`movieId\`, \`tagId\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_6bfcd8b79900d13de31fc4098f2\` FOREIGN KEY (\`roomId\`) REFERENCES \`room\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` ADD CONSTRAINT \`FK_f056a463749c7b7b6700511bed7\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movieTags\` ADD CONSTRAINT \`FK_d26a7ec914691b8293717d820d4\` FOREIGN KEY (\`movieId\`) REFERENCES \`movie\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movieTags\` ADD CONSTRAINT \`FK_4c980c686da573f4d7260b56aa7\` FOREIGN KEY (\`tagId\`) REFERENCES \`tag\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`movieTags\` DROP FOREIGN KEY \`FK_4c980c686da573f4d7260b56aa7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movieTags\` DROP FOREIGN KEY \`FK_d26a7ec914691b8293717d820d4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_f056a463749c7b7b6700511bed7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`session\` DROP FOREIGN KEY \`FK_6bfcd8b79900d13de31fc4098f2\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_4c980c686da573f4d7260b56aa\` ON \`movieTags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d26a7ec914691b8293717d820d\` ON \`movieTags\``,
    );
    await queryRunner.query(`DROP TABLE \`movieTags\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`session\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_535c742a3606d2e3122f441b26\` ON \`room\``,
    );
    await queryRunner.query(`DROP TABLE \`room\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a81090ad0ceb645f30f9399c34\` ON \`movie\``,
    );
    await queryRunner.query(`DROP TABLE \`movie\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_9dbf61b2d00d2c77d3b5ced37c\` ON \`tag\``,
    );
    await queryRunner.query(`DROP TABLE \`tag\``);
  }
}
