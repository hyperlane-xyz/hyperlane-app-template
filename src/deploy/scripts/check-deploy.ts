import { AbacusBridge, addresses } from '@abacus-network/bridge-sdk';
import { AbacusGovernance, governanceAddresses } from '@abacus-network/sdk';

import {
  getEnvironment,
  getBridgeConfig,
  registerMultiProvider,
} from './utils';

import { AbacusBridgeChecker } from '../src/check';

async function check() {
  const environment = await getEnvironment();
  const bridge = new AbacusBridge(addresses);
  const governance = new AbacusGovernance(governanceAddresses[environment]);
  registerMultiProvider(bridge, environment);
  registerMultiProvider(governance, environment);

  const bridgeConfig = await getBridgeConfig(environment);
  const bridgeChecker = new AbacusBridgeChecker(bridge, bridgeConfig);
  await bridgeChecker.check(governance.routerAddresses);
  bridgeChecker.expectEmpty();
}

check().then(console.log).catch(console.error);
