import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  connectionTimeoutMillis: 3 * 1000,
  // user: process.env.PGUSER,
  // password: process.env.PGPASSSWORD,
  // host: process.env.PGHOST,
  // port: Number(process.env.PGPORT),
  // database: process.env.PGDATABASE,
});

export const query = async (text: string, values?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, values);
  const elapsed_time = (Date.now() - start) / 1000;
  Log(
    {
      text,
      elapsed_time,
      rows: res?.rowCount,
    },
    {
      active: pool.totalCount,
      idle: pool.idleCount,
      waiting: pool.waitingCount,
    }
  );

  return res;
};

export const transaction = async (text: string, values?: any[]) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const res = await client.query(text, values);
    await client.query("COMMIT");
  } catch (e) {
    console.error("TRANSACTION Error:", e);
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
};

type DMLInfo = {
  text: string;
  elapsed_time: number;
  rows: any;
};

type PoolInfo = {
  active: number;
  idle: number;
  waiting: number;
};

const Log = (
  { text, elapsed_time, rows }: DMLInfo,
  { active, idle, waiting }: PoolInfo
) => {
  console.info("DML >>> ", new Date().toLocaleString(), {
    text,
    elapsed_time,
    rows,
  });
  console.debug("POOL >>> ", {
    active,
    idle,
    waiting,
  });
};
