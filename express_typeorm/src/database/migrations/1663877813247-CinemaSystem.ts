import {MigrationInterface, QueryRunner, Table, TableForeignKey} from 'typeorm';
import {addYears, format, setDate, setHours, setMonth, subYears} from "date-fns";

export class CinemaSystem1663877813247 implements MigrationInterface {
  name = 'CinemaSystem1663877813247';
  /**
   # ToDo: Create a migration that creates all tables for the following user stories

   For an example on how a UI for an api using this might look like, please try to book a show at https://in.bookmyshow.com/.
   To not introduce additional complexity, please consider only one cinema.

   Please list the tables that you would create including keys, foreign keys and attributes that are required by the user stories.

   ## User Stories

   **Movie exploration**
   * As a user I want to see which films can be watched and at what times
   * As a user I want to only see the shows which are not booked out

   **Show administration**
   * As a cinema owner I want to run different films at different times
   * As a cinema owner I want to run multiple films at the same time in different showrooms

   **Pricing**
   * As a cinema owner I want to get paid differently per show
   * As a cinema owner I want to give different seat types a percentage premium, for example 50 % more for vip seat

   **Seating**
   * As a user I want to book a seat
   * As a user I want to book a vip seat/couple seat/super vip/whatever
   * As a user I want to see which seats are still available
   * As a user I want to know where I'm sitting on my ticket
   * As a cinema owner I dont want to configure the seating for every show
   */
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
        new Table({
          name: 'movies',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'varchar' },
            { name: 'description', type: 'varchar' },
            { name: 'releaseDate', type: 'timestamp' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'cinema',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'varchar' },
            { name: 'address', type: 'varchar' },
            { name: 'ownerId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'cinema_show_rooms',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'varchar' },
            { name: 'cinemaId', type: 'integer' },
            { name: 'details', type: 'varchar' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'shows',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'movieId', type: 'integer' },
            { name: 'cinemaId', type: 'integer' },
            { name: 'cinemaShowRoomId', type: 'integer' },
            { name: 'start', type: 'timestamp' },
            { name: 'end', type: 'timestamp' },
            { name: 'status', type: 'varchar' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );


    await queryRunner.createTable(
        new Table({
          name: 'cinema_seats',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'seatNumber', type: 'varchar' },
            { name: 'seatType', type: 'varchar' },
            { name: 'seatRow', type: 'integer' },
            { name: 'orderNumber', type: 'integer' },
            { name: 'cinemaId', type: 'integer' },
            { name: 'cinemaShowRoomId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'cinema_pricing',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'seatType', type: 'varchar' },
            { name: 'price', type: 'integer' },
            { name: 'cinemaId', type: 'integer' },
            { name: 'cinemaShowRoomId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'booking',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'tax', type: 'integer' },
            { name: 'total', type: 'integer' },
            { name: 'paymentDetails', type: 'varchar' },
            { name: 'paymentStatus', type: 'varchar' },
            { name: 'bookingStatus', type: 'varchar' },
            { name: 'cinemaId', type: 'integer' },
            { name: 'cinemaShowRoomId', type: 'integer' },
            { name: 'userId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'booking_seats',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'bookingId', type: 'integer' },
            { name: 'cinemaId', type: 'integer' },
            { name: 'cinemaShowRoomId', type: 'integer' },
            { name: 'price', type: 'integer' },
            { name: 'cinemaSeatsId', type: 'integer' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    await queryRunner.createTable(
        new Table({
          name: 'user',
          columns: [
            {
              name: 'id',
              isPrimary: true,
              type: 'integer',
              isGenerated: true,
              generationStrategy: 'increment',
            },
            { name: 'name', type: 'varchar' },
            { name: 'type', type: 'varchar' },
            {
              name: 'createdAt',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
            },
          ],
        }),
    );

    const cinemaId = {
      columnNames: ['cinemaId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'cinema',
      onDelete: 'CASCADE',
    };
    const cinemaShowRoomId = {
      columnNames: ['cinemaShowRoomId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'cinema_show_rooms',
      onDelete: 'CASCADE',
    };

    const movieId = {
      columnNames: ['movieId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'movies',
      onDelete: 'CASCADE',
    };

    const cinemaSeatsId = {
      columnNames: ['cinemaSeatsId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'cinema_seats',
      onDelete: 'CASCADE',
    }

    const bookingId = {
      columnNames: ['bookingId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'booking',
      onDelete: 'CASCADE',
    }

    const userId = {
      columnNames: ['userId'],
      referencedColumnNames: ['id'],
      referencedTableName: 'user',
      onDelete: 'CASCADE',
    }

    await queryRunner.createForeignKey(
        'cinema',
        new TableForeignKey({
          columnNames: ['ownerId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
        }),
    );

    await queryRunner.createForeignKey(
        'cinema_show_rooms',
        new TableForeignKey(cinemaId),
    );
    await queryRunner.createForeignKey(
        'shows',
        new TableForeignKey(movieId),
    );
    await queryRunner.createForeignKey(
        'shows',
        new TableForeignKey(cinemaId),
    );
    await queryRunner.createForeignKey(
        'shows',
        new TableForeignKey(cinemaShowRoomId),
    );
    await queryRunner.createForeignKey(
        'cinema_seats',
        new TableForeignKey(cinemaId),
    );
    await queryRunner.createForeignKey(
        'cinema_seats',
        new TableForeignKey(cinemaShowRoomId),
    );
    await queryRunner.createForeignKey(
        'cinema_pricing',
        new TableForeignKey(cinemaId),
    );
    await queryRunner.createForeignKey(
        'cinema_pricing',
        new TableForeignKey(cinemaShowRoomId),
    );
    await queryRunner.createForeignKey(
        'booking',
        new TableForeignKey(cinemaId),
    );
    await queryRunner.createForeignKey(
        'booking',
        new TableForeignKey(cinemaShowRoomId),
    );
    await queryRunner.createForeignKey(
        'booking',
        new TableForeignKey(userId),
    );
    await queryRunner.createForeignKey(
        'booking_seats',
        new TableForeignKey(bookingId),
    );
    await queryRunner.createForeignKey(
        'booking_seats',
        new TableForeignKey(cinemaId),
    );
    await queryRunner.createForeignKey(
        'booking_seats',
        new TableForeignKey(cinemaShowRoomId),
    );
    await queryRunner.createForeignKey(
        'booking_seats',
        new TableForeignKey(cinemaSeatsId),
    );

    try {
      await queryRunner.query(`INSERT INTO \`user\` (\`id\`, \`name\`, \`type\`) VALUES
          (1, 'Sridhar Bala', 'user'),
          (2, 'PVR', 'owner')`);
      await queryRunner.query(`INSERT INTO \`movies\` (\`id\`, \`name\`, \`description\`, \`releaseDate\`) VALUES
          (1, 'Billa', 'Super Movie', '2022-12-01 00:00:00'),
          (2, 'Bahubali', 'Super Movie', '2022-12-02 00:00:00')`);
      await queryRunner.query(`INSERT INTO \`cinema\` (\`id\`, \`name\`, \`address\`, \`ownerId\`) VALUES
          (1, 'PVR Cinema', 'Bangalore MG Road', 2),
          (2, 'PVR Cinema', 'Chennai MG Road', 2)`);
      await queryRunner.query(`INSERT INTO \`cinema_show_rooms\` (\`id\`, \`name\`, \`cinemaId\`, \`details\`) VALUES
          (1, 'First Floor', 1, '2D Movie'),
          (2, 'Second Floor', 1, '3D Movie')`);
      await queryRunner.query(`INSERT INTO \`shows\` (\`id\`, \`movieId\`, \`cinemaId\`, \`cinemaShowRoomId\`, \`start\`,
                                                      \`end\`, \`status\`) VALUES
          (1, 1, 1, 1, '2022-12-01 10:00:00', '2022-12-01 13:00:00', 'open'),
          (2, 2, 1, 2, '2022-12-01 10:00:00', '2022-12-01 13:00:00', 'open')`);
      await queryRunner.query(`INSERT INTO \`cinema_seats\` (\`id\`, \`seatNumber\`, \`seatType\`, \`seatRow\`,
                                                             \`orderNumber\`, \`cinemaId\`, \`cinemaShowRoomId\`) VALUES
          (1, '1A', 'Normal', 1, 1, 1, 1),
          (2, '2A', 'VIP', 2, 2, 1, 1),
          (3, '1A', 'Normal', 1, 1, 2, 1),
          (4, '2A', 'VIP', 2, 2, 2, 2)`);
      await queryRunner.query(`INSERT INTO \`cinema_pricing\` (\`id\`, \`seatType\`, \`price\`, \`cinemaId\`, \`cinemaShowRoomId\`) VALUES
          (1, 'Normal', 100, 1, 1),
          (2, 'VIP', 150, 1, 2)`);
      await queryRunner.query(`INSERT INTO \`booking\` (\`id\`, \`tax\`, \`total\`, \`paymentDetails\`, \`paymentStatus\`,
                                                        \`bookingStatus\`, \`cinemaId\`, \`cinemaShowRoomId\`,
                                                        \`userId\`) VALUES
          (1, 0, 100, 'Cash Payment', 'Paid', 'booked', 1, 1, 1)`);
      await queryRunner.query(`INSERT INTO \`booking_seats\` (\`id\`, \`bookingId\`, \`cinemaId\`, \`cinemaShowRoomId\`, \`price\`,
                                                        \`cinemaSeatsId\`) VALUES
          (1, 1, 1, 1, 100, 1)`);
    } catch (error) {
      // await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
