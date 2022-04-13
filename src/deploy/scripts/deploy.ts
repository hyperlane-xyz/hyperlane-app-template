import path from 'path';
import { AbacusCore } from '@abacus-network/sdk';
import { utils } from '@abacus-network/deploy';
import { PingPongDeployer } from '../deploy';
import { getEnvironmentConfig } from './utils';

async function main() {
  const environment = await utils.getEnvironment();
  const core = new AbacusCore(environment);
  const deployer = new PingPongDeployer(core);
  const config = await getEnvironmentConfig(environment);
  await utils.registerEnvironment(core, config);
  await utils.registerEnvironment(deployer, config);
  await deployer.deploy(utils.getRouterConfig(core));

  deployer.writeOutput(path.join('./src/deploy/output/', environment));
}

main().then(console.log).catch(console.error);
