import {ClaimAPI, HttpClient} from "./claimAPI.ts";

const httpClient = new HttpClient({ baseUrl: import.meta.env.VITE_CLAIM_API_ENDPOINT });

export const claimAPI = new ClaimAPI(httpClient)
