import { EnvironmentConfig, RouterConfig } from '@abacus-network/deploy';

import { configs } from '../networks';

export type PingPongConfig = EnvironmentConfig & {
  config: RouterConfig;
};

export const environment: PingPongConfig = {
  transactionConfigs: configs,
  domains: ['alfajores', 'kovan', 'mumbai', 'fuji'],
  // Specifying an empty RouterConfig means a xAppConnectionManager will be deployed for us.
  config: {},
};
