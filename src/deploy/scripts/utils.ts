import path from 'path';
import { EnvironmentConfig } from '@abacus-network/deploy';

export function moduleName(environment: string) {
  return path.join('../environments/', environment);
}

export async function getEnvironmentConfig(
  environment: string,
): Promise<EnvironmentConfig> {
  return (await import(moduleName(environment))).environment;
}
