import { TonApiClient } from "@ton-api/client";

const ta = new TonApiClient({
  baseUrl: import.meta.env.VITE_TONAPI_ENDPOINT ?? "https://tonapi.io",
});

export default ta;
