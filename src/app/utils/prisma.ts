import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import config from "../config";

const pool = new Pool({
  connectionString: config.database_url,
  max: 20,
  idleTimeoutMillis: 30000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
