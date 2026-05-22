import config from "./src/app/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  datasource: {
    url: config.database_url || env("DATABASE_URL"),
  },
});
