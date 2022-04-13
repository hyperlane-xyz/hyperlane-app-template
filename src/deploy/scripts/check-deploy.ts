import path from 'path';
import { AbacusCore } from '@abacus-network/sdk';
import { utils } from '@abacus-network/deploy';
import { PingPongChecker } from '../check';
import { PingPongApp } from '../../sdk';

async function check() {
  const environment = await utils.getEnvironment();
  const pingPong = new PingPongApp(environment);
  const config = await utils.getEnvironmentConfig(
    path.join('../environment', environment),
  );
  await utils.registerEnvironment(pingPong, config);

  const core = new AbacusCore(environment);
  const checker = new PingPongChecker(pingPong, utils.getRouterConfig(core));
  await checker.check();
  checker.expectEmpty();
}

check().then(console.log).catch(console.error);
