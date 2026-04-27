import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../../env";
import { User } from "../../entities/users";
import { Otp } from "../../entities/otps";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  synchronize: false,
  entities: [User, Otp],
  migrations: [__dirname + "/../../migrations/*.{ts,js}"],
});
