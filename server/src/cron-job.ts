import { CronJob } from "cron";
import config from "./config";
import Database from "./database";
import SentimentAnalysis from "./sentiment-analysis";
import Twitter from "./twitter";

const twitter = new Twitter();
const sentimentAnalysis = new SentimentAnalysis();

const fetchTweetsFromTwitter = async () => {
  const date = new Date().toLocaleDateString();
  const database = await Database.create();
  // fetch twitter data
  const tweets = await twitter.getRecentTweets(config.keyword);
  for (const tweet of tweets) {
    // define score
    tweet.score = await sentimentAnalysis.analyze(tweet.text);
    // save into database
    console.log(tweet);
    database.saveTweet(tweet, config.keyword, date).catch(console.log);
  }
};

// midnight
const job = new CronJob("00 00 00 * * *", async () => fetchTweetsFromTwitter());
// start cron job
job.start();

/*
// To fetch manually (today) 
(async () => {
  fetchTweetsFromTwitter()
})()
*/
