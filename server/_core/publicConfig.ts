export function publicPlatformConfig(env: NodeJS.ProcessEnv = process.env) {
  return {
    apiUrl: env.CARTEIRA_API_URL ?? "",
    apiBrowserKey: env.CARTEIRA_MAPS_KEY ?? "",
  };
}

export function publicPlatformScript(env: NodeJS.ProcessEnv = process.env): string {
  const json = JSON.stringify(publicPlatformConfig(env)).replaceAll("<", "\\u003c");
  return `window.__CARTEIRA_CONFIG__=${json};`;
}
