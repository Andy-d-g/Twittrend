import language, { LanguageServiceClient } from "@google-cloud/language";
import { google } from "@google-cloud/language/build/protos/protos";
import { GoogleAuth } from "google-auth-library";

class SentimentAnalysis {
  private client: LanguageServiceClient;
  constructor() {
    this.client = new language.LanguageServiceClient({
      auth: new GoogleAuth({
        keyFilename: "./googleKeys.json",
        scopes: ["https://www.googleapis.com/auth/cloud-language"],
      }),
    });
  }

  public analyze = async (text: string) => {
    const document: google.cloud.language.v1.IDocument = {
      content: text,
      type: "PLAIN_TEXT",
      language: "en",
    };
    const [result] = await this.client.analyzeSentiment({
      document,
      encodingType: "UTF8",
    });
    const sentiment = result.documentSentiment;
    if (!sentiment) {
      throw new Error("no sentiment");
    }
    console.log(`Score : ${sentiment.score! * sentiment.magnitude!}`);
    return (sentiment.score! * sentiment.magnitude!).toString();
  };
}

export default SentimentAnalysis;
