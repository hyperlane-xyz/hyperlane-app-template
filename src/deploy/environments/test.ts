import { configs } from '../networks';
import { PingPongConfig } from './index';

export const environment: PingPongConfig = {
  transactionConfigs: configs,
  domains: ['alfajores', 'kovan', 'mumbai', 'fuji'],
  // Specifying an empty RouterConfig means a xAppConnectionManager will be deployed for us.
  config: {},
};
