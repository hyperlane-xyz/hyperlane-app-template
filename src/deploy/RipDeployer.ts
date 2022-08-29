import {
  AbacusCore,
  AbacusRouterDeployer,
  ChainMap,
  ChainName,
  MultiProvider,
  RouterConfig,
} from '@abacus-network/sdk';

import {
  RemoteIdentityProxyRouterContracts,
  RemoteIdentityProxyRouterFactories,
  helloWorldFactories,
} from '../app/RipContracts';


export class RemoteIdentityProxyRouterDeployer<
  Chain extends ChainName,
> extends AbacusRouterDeployer<
  Chain,
  RouterConfig,
  RemoteIdentityProxyRouterContracts,
  RemoteIdentityProxyRouterFactories
> {
  constructor(
    multiProvider: MultiProvider<Chain>,
    configMap: ChainMap<Chain, RouterConfig>,
    protected core: AbacusCore<Chain>,
  ) {
    super(multiProvider, configMap, helloWorldFactories, {});
  }

  // Custom contract deployment logic can go here
  // If no custom logic is needed, call deployContract for the router
  async deployContracts(chain: Chain, config: RouterConfig) {
    const router = await this.deployContract(chain, 'router', [
      config.abacusConnectionManager,
      config.interchainGasPaymaster,
    ]);
    return {
      router,
    };
  }
}
