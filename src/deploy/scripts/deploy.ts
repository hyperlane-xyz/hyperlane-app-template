import { utils } from '@abacus-network/deploy';
import { AbacusCore, coreAddresses } from '@abacus-network/sdk';
import path from 'path';
import { PingPongDeployer } from '../deploy';
import { getEnvironmentConfig } from './utils';

async function main() {
  const environment = await utils.getEnvironment();
  const core = new AbacusCore(coreAddresses);
  const deployer = new PingPongDeployer(core);
  const config = await getEnvironmentConfig(environment as any);
  await utils.registerEnvironment(core, config);
  await utils.registerEnvironment(deployer, config);
  await deployer.deploy(utils.getRouterConfig(core) as any); // TODO: fix types

  deployer.writeOutput(path.join('./src/deploy/output/', environment));
}

main().then(console.log).catch(console.error);
