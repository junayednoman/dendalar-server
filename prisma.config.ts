import { defineConfig, PrismaConfig } from "prisma/config";
import config from "./src/app/config/index";

export default defineConfig({
  datasource: {
    url: config.database_url,
  },
}) satisfies PrismaConfig;
