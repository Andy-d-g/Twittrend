import axios from "axios";

export interface Score {
  score: number;
  date: string
} 

axios.defaults.baseURL = "http://localhost:8000";

const fetchKeyword = async (): Promise<string> => {
  try {
    const response = await axios.get("/keyword");
    return response.data;
  } catch (e) {
    console.error("Error when fetching keyword");
    return "<--unknown-->";
  }
};

const fetchScores = async (): Promise<Score[]> => {
  try {
    const response = await axios.get(`/scores`);
    return response.data;
  } catch (e) {
    console.error("Error when fetching scores")
    return []
  }
};

export default {
  fetchKeyword,
  fetchScores,
};
