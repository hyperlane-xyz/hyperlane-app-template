import { AbacusRouterDeployer } from '@abacus-network/deploy';
import { ChainName } from '@abacus-network/sdk';

import { HelloWorldContracts, HelloWorldFactories } from '../sdk/contracts';
import { HelloWorldConfig } from '../sdk/config';

export class HelloWorldDeployer<
  Chain extends ChainName,
> extends AbacusRouterDeployer<
  Chain,
  HelloWorldConfig,
  HelloWorldFactories,
  HelloWorldContracts
> {
  // TODO remove need for this boilerplate
  async deployContracts(chain: Chain, config: HelloWorldConfig) {
    const dc = this.multiProvider.getChainConnection(chain);

    const router = await this.deployContract(chain, 'router', []);

    const initTx = await router.initialize(config.abacusConnectionManager);
    await initTx.wait(dc.confirmations);

    return {
      router: router,
      helloWorld: router,
    };
  }
}
