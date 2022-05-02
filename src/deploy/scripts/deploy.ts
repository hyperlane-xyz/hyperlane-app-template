import { utils } from '@abacus-network/deploy';
import { AbacusCore, coreAddresses } from '@abacus-network/sdk';
import path from 'path';
import { PingPongDeployer } from '../deploy';
import { environments } from '../environments';

async function main() {
  const name = await utils.getEnvironment();
  const environment = environments[name as keyof typeof environments];

  const core = new AbacusCore(coreAddresses);
  const deployer = new PingPongDeployer(core);
  await utils.registerEnvironment(core, environments[environment]);
  await utils.registerEnvironment(deployer, config);
  await deployer.deploy(utils.getRouterConfig(core) as any); // TODO: fix types

  deployer.writeOutput(path.join('./src/deploy/output/', environment));
}

main().then(console.log).catch(console.error);
