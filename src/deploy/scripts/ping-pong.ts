import { AbacusCore, coreAddresses } from '@abacus-network/sdk';
import {
  getEnvironment,
  getBridgeConfig,
  getBridgeContractsSdkFilepath,
  getBridgeVerificationDirectory,
  registerMultiProvider,
} from './utils';
import { AbacusBridgeDeployer } from '../src';

async function main() {
  const environment = await getEnvironment();
  const core = new AbacusCore(coreAddresses[environment]);
  const bridgeDeployer = new AbacusBridgeDeployer(core);
  await registerMultiProvider(core, environment);
  await registerMultiProvider(bridgeDeployer, environment);

  const bridgeConfig = await getBridgeConfig(environment);
  await bridgeDeployer.deploy(bridgeConfig);

  bridgeDeployer.writeContracts(getBridgeContractsSdkFilepath(environment));
  bridgeDeployer.writeVerification(getBridgeVerificationDirectory(environment));
}

main().then(console.log).catch(console.error);
