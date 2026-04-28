import { AppDataSource } from "./config/db/db";
import app from "./app";
import { env } from "./env";
import { connectRedis } from "./config/redis";

AppDataSource.initialize()
  .then(async() => {
    console.log("Database is connected successfully");
    await connectRedis();
    console.log("Redis connected successfully");
    app.listen(env.PORT, () => {
      console.log("Servering is running on port : ", env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error while connectin to postgres", error);
  });
