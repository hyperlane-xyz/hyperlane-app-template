import { DeployEnvironmnet } from '@abacus-network/deploy';

import { configs } from '../networks/testnets';

export const test: DeployEnvironment = {
  transactionConfigs: configs,
  domainNames: [
    'alfajores',
    'kovan',
    'mumbai',
    'fuji',
  ],
}
