const rateBuckets = new Map<string, number[]>();

function checkAssistantRateLimit(ip: string, maxCalls = 30, windowMs = 3600000): boolean {
  const now = Date.now();
  const times = rateBuckets.get(ip) ?? [];
  const recent = times.filter((t) => now - t < windowMs);
  if (recent.length >= maxCalls) return false;
  recent.push(now);
  rateBuckets.set(ip, recent);
  return true;
}

export { checkAssistantRateLimit };
