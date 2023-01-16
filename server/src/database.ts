import config from "./config";
import { Connection, createConnection } from "promise-mysql";
import { Tweet } from "./twitter";

const tweetColumns = [
  "id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY",
  "date TEXT(16382)",
  "text TEXT(16382)",
  "score TEXT(16382)",
  "keyword TEXT(16382)",
];
const dbName = "twittrend";
const tableName = "tweets";

interface TweetDB extends Tweet {
  id: number;
  date: string;
  text: string;
  score: string;
  keyword: string;
}

class Database {
  private conn: Connection;

  constructor(conn: Connection) {
    this.conn = conn;
  }

  public static create = async () => {
    const conn = await createConnection({
      host: config.db.host,
      user: config.db.user,
      database: dbName,
      password: config.db.password,
      port: config.db.port,
    });
    const database = new Database(conn);
    await database.upsertDatabase(dbName);
    await database.useDatabase(dbName);
    await database.upsertTable(tableName);
    return database;
  };

  private useDatabase = async (db: string) => {
    const sql = `USE ${db}`;
    return this.conn.query(sql);
  };

  private upsertDatabase = async (db: string) => {
    const sql = `CREATE DATABASE IF NOT EXISTS ${db}`;
    return this.conn.query(sql);
  };

  private dropTable = async (table: string) => {
    const sql = `DROP TABLE ${table}`;
    return this.conn.query(sql);
  };

  private upsertTable = async (table: string) => {
    // prettier-ignore
    const sql = `CREATE TABLE IF NOT EXISTS ${table} (${tweetColumns.join(", ")})`;
    return this.conn.query(sql);
  };

  public saveTweet = async (
    tweet: Tweet,
    keyword: string,
    date: string
  ): Promise<{ id: number }> => {
    const sql = `INSERT INTO tweets (date, text, score, keyword) VALUES ('${date}', '${tweet.text}', '${tweet.score}', '${keyword}')`;
    const res = await this.conn.query(sql);
    return { id: parseInt(res.insertId, 10) };
  };

  public fetchByDate = async (date: string): Promise<TweetDB[]> => {
    const sql = `SELECT * FROM tweets WHERE date = '${date}'`;
    const data = await this.conn.query(sql);
    return data;
  };

  public fetchScoreByDate = async (date: string): Promise<number> => {
    const data = await this.fetchByDate(date);
    return (
      data
        .map((d) => parseFloat(d.score))
        .reduce((a, b) => a + b, 0)
    );
  };

  public end = () => {
    this.conn.end();
  };
}

export default Database;
