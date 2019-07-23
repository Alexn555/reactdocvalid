import axios from "axios";

export const client = axios.create({
  baseURL: "http://fe-test.guardtime.com/",
  headers: {
    "Content-Type": "application/json"
  }
});
