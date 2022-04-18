import { environments, PingPongConfig } from '../environments';

export async function getEnvironmentConfig(
  environment: keyof typeof environments,
): Promise<PingPongConfig> {
  return environments[environment];
}
