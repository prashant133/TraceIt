import { AppDataSource } from "./config/db/db";
import app from "./app";
import { env } from "./env";

AppDataSource.initialize()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log("Servering is running on port : ", env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error while connectin to postgres",error);
  });
