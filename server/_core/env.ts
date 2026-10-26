export const ENV = {
  get forgeApiUrl() { return process.env.CARTEIRA_API_URL ?? ""; },
  get forgeApiKey() { return process.env.CARTEIRA_API_KEY ?? ""; },
};
