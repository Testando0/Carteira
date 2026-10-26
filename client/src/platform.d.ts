export {};
declare global {
  interface Window {
    __CARTEIRA_CONFIG__?: { apiUrl?: string };
    __MANUS_CONFIG__?: { apiUrl?: string; apiBrowserKey?: string; projectId?: string };
  }
}
