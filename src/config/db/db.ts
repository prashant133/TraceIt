import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "../../env";
import { User } from "../../entities/users";
import { Otp } from "../../entities/otps";
import { Shoe } from "../../entities/shoes";
import { Purchase } from "../../entities/purchases";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,

  synchronize: false,
  entities: [User, Otp,Shoe,Purchase],
  migrations: [__dirname + "/../../migrations/*.{ts,js}"],
});
