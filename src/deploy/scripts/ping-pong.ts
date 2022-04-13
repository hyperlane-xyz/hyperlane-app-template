import path from 'path';
import { AbacusCore } from '@abacus-network/sdk';
import { utils } from '@abacus-network/deploy';
import { PingPongDeployer } from '../deploy';

async function main() {
  const environment = await utils.getEnvironment();
  const core = new AbacusCore(environment);
  const deployer = new PingPongDeployer(core);
  const config = await utils.getEnvironmentConfig(
    path.join('../environment', environment),
  );
  await utils.registerEnvironment(core, config);
  await utils.registerEnvironment(deployer, config);
  // We haven't configured a signer, so this will probably fail...
  await deployer.deploy(utils.getRouterConfig(core));

  deployer.writeContracts(
    path.join('../../sdk/src/environments/', `${environment}.ts`),
  );
  deployer.writeVerification(path.join('..', `${environment}.json`));
}

main().then(console.log).catch(console.error);
