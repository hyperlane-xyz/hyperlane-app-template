import { AbacusCore } from '@abacus-network/sdk';
import { utils } from '@abacus-network/deploy';
import { PingPongChecker } from '../check';
import { PingPongApp } from '../../sdk';
import { getEnvironmentConfig } from './utils';

async function check() {
  const environment = await utils.getEnvironment();
  const pingPong = new PingPongApp(environment);
  const config = await getEnvironmentConfig(environment);
  await utils.registerEnvironment(pingPong, config);

  const core = new AbacusCore(environment);
  await utils.registerEnvironment(core, config);
  const checker = new PingPongChecker(pingPong, utils.getRouterConfig(core));
  const owner = await pingPong
    .mustGetSigner(pingPong.domainNumbers[0])
    .getAddress();
  await checker.check(owner);
  checker.expectEmpty();
}

check().then(console.log).catch(console.error);
