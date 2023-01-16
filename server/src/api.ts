require("./cron-job");
import Database from "./database";
import cors from "cors";
import express, { Response, Request } from "express";
import config from "./config";

const dateHelper = (ms = 0) =>
  new Date(new Date().getTime() - ms).toLocaleDateString();

const app = express().use(cors({ origin: "*" }));

const databasePromise = Database.create();

app.get("/scores", async (req: Request, res: Response) => {
  const database = await databasePromise;
  const history = 7;
  const scores = Array.of();
  for (let i = 0; i < history; i++) {
    const date = dateHelper(1000 * 60 * 60 * 24 * (history - i - 1));
    const score = await database.fetchScoreByDate(date);
    scores.push({ score, date });
  }
  console.log(scores)
  res.status(200).send(scores);
});

app.get("/keyword", async (req: Request, res: Response) => {
  res.status(200).send(config.keyword);
});

app.listen(8000, () => {
  console.log(`App listening on port 8000`);
});
