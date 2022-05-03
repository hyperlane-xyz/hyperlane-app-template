import { UpgradeBeaconController__factory } from '@abacus-network/core';
import { AbacusRouterDeployer } from '@abacus-network/deploy';
import {
  AbacusCore,
  ChainName,
  ChainMap,
  MultiProvider,
} from '@abacus-network/sdk';
import { PingPongAddresses } from '../sdk/contracts';
import { PingPongConfig } from '../sdk/types';
import { PingPong__factory } from '../types';

export class PingPongDeployer<
  Networks extends ChainName,
> extends AbacusRouterDeployer<
  Networks,
  PingPongConfig<Networks>,
  PingPongAddresses
> {
  constructor(
    multiProvider: MultiProvider<Networks>,
    config: PingPongConfig<Networks>,
    core?: AbacusCore<Networks>,
  ) {
    const networks = multiProvider.networks();
    const crossConfigMap = Object.fromEntries(
      networks.map((network) => [network, config]),
    ) as ChainMap<Networks, PingPongConfig<Networks>>;
    super(multiProvider, crossConfigMap, core);
  }

  async deployContracts(
    network: Networks,
    config: PingPongConfig<Networks>,
  ): Promise<PingPongAddresses> {
    const dc = this.multiProvider.getDomainConnection(network);
    const signer = dc.signer!;

    const abacusConnectionManager =
      await this.deployConnectionManagerIfNotConfigured(network);

    const upgradeBeaconController = await this.deployContract(
      network,
      'UpgradeBeaconController',
      new UpgradeBeaconController__factory(signer),
      [],
    );

    const router = await this.deployProxiedContract(
      network,
      'PingPong',
      new PingPong__factory(signer),
      [],
      upgradeBeaconController.address,
      [abacusConnectionManager.address],
    );

    // Only transfer ownership if a new ACM was deployed.
    if (abacusConnectionManager.deployTransaction) {
      await abacusConnectionManager.transferOwnership(
        router.address,
        dc.overrides,
      );
    }
    await upgradeBeaconController.transferOwnership(
      router.address,
      dc.overrides,
    );

    return {
      router: router.addresses,
      upgradeBeaconController: upgradeBeaconController.address,
      abacusConnectionManager: abacusConnectionManager.address,
    };
  }

  mustGetRouter(network: Networks, addresses: PingPongAddresses) {
    return PingPong__factory.connect(
      addresses.router.proxy,
      this.multiProvider.getDomainConnection(network).signer!,
    );
  }
}
