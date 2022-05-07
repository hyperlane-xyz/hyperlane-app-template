import { EnvironmentConfig, RouterConfig } from '@abacus-network/deploy';
import { TemplateNetworks } from '../../deploy/networks';
import { environment as testEnvironment } from './test';

export type PingPongConfig = EnvironmentConfig<TemplateNetworks> & {
  config: RouterConfig;
};

export const environments = {
  test: testEnvironment,
};
