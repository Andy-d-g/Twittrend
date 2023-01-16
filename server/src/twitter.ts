import { Client } from "twitter-api-sdk";
import { encode } from "utf8";
import config from "./config";

export interface Tweet {
  text: string;
  score?: string;
}

const dateHelper = (ms: number) =>
  new Date(new Date().getTime() - ms).toISOString();

class Twitter {
  private client: Client;
  constructor() {
    this.client = new Client(config.twitterApiKey);
  }

  private getFromToken = async (
    subject: string,
    nextToken: string | undefined
  ) => {
    return await this.client.tweets.tweetsRecentSearch({
      query: subject,
      max_results: 100,
      sort_order: "recency",
      // @ts-ignore
      "tweet.fields": "text",
      next_token: nextToken,
    });
  };

  public getRecentTweets = async (subject: string) => {
    try {
      const tweets: Tweet[] = [];
      let response = await this.client.tweets.tweetsRecentSearch({
        query: subject,
        max_results: 100,
        start_time: dateHelper(1000 * 60 * 60 * 24),
        end_time: dateHelper(1000 * 30),
        sort_order: "recency",
        // @ts-ignore
        "tweet.fields": ["text"],
      });
      (response.data || []).map((tweet) =>
        tweets.push({ text: encode(tweet.text) })
      );
      let nextToken = (response.meta || {}).next_token;
      while (nextToken) {
        response = await this.getFromToken(subject, nextToken);
        (response.data || []).map((tweet) => tweets.push({ text: tweet.text }));
        nextToken = (response.meta || {}).next_token;
      }
      return tweets;
    } catch (e: any) {
      console.log(e.error.errors);
      console.log(e.error.errors[0].parameters);
      return [];
    }
  };
}

export default Twitter;
