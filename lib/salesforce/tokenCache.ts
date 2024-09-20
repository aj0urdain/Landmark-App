interface TokenData {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, TokenData>();

export function getTokenFromCache(
  key: string = 'salesforce'
): TokenData | undefined {
  const data = tokenCache.get(key);
  if (data && Date.now() < data.expiresAt) {
    console.log('Token is still valid and retrieved from cache.');
    return data;
  }
  return undefined;
}

export function setTokenInCache(
  token: string,
  expiresIn: number,
  key: string = 'salesforce'
): void {
  const expiresAt = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds
  tokenCache.set(key, { token, expiresAt });
  console.log('Token stored in cache.');
}
