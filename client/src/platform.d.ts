export {};
declare global {
  interface Window {
    __CARTEIRA_CONFIG__?: { apiUrl?: string; apiBrowserKey?: string };
  }
}
