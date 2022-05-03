// import { utils } from '@abacus-network/deploy';
// import { AbacusCore, coreAddresses } from '@abacus-network/sdk';
// import { PingPongApp } from '../../sdk';
// import { addresses } from '../../sdk/environments';
// import { PingPongChecker } from '../check';
// import { getEnvironmentConfig } from './utils';

// async function check() {
//   const environment = await utils.getEnvironment();
//   const pingPong = new PingPongApp(addresses);
//   const config = await getEnvironmentConfig(environment as any);
//   await utils.registerEnvironment(pingPong, config);

//   const core = new AbacusCore(coreAddresses);
//   await utils.registerEnvironment(core, config);
//   const checker = new PingPongChecker(pingPong, utils.getRouterConfig(core));
//   const owner = await pingPong
//     .mustGetSigner(pingPong.domainNumbers[0])
//     .getAddress();
//   await checker.check(owner);
//   checker.expectEmpty();
// }

// check().then(console.log).catch(console.error);
