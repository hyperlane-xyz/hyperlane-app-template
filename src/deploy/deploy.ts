import { UpgradeBeaconController__factory } from '@abacus-network/core';
import { AbacusRouterDeployer } from '@abacus-network/deploy';
import {
  AbacusCore,
  ChainName,
  ChainMap,
  MultiProvider,
} from '@abacus-network/sdk';
import { YoAddresses } from '../sdk/contracts';
import { YoConfig } from '../sdk/types';
import { Yo__factory } from '../types';

export class YoDeployer<
  Networks extends ChainName,
> extends AbacusRouterDeployer<
  Networks,
  YoConfig,
  YoAddresses
> {
  constructor(
    multiProvider: MultiProvider<Networks>,
    config: YoConfig,
    core: AbacusCore<Networks>,
  ) {
    const networks = multiProvider.networks();
    const crossConfigMap = Object.fromEntries(
      networks.map((network) => [network, config]),
    ) as ChainMap<Networks, YoConfig>;
    super(multiProvider, crossConfigMap, core);
  }

  async deployContracts(
    network: Networks,
    config: YoConfig,
  ): Promise<YoAddresses> {
    const dc = this.multiProvider.getDomainConnection(network);
    const signer = dc.signer!;

    const abacusConnectionManager = this.core?.getContracts(network).abacusConnectionManager!

    const upgradeBeaconController = await this.deployContract(
      network,
      'UpgradeBeaconController',
      new UpgradeBeaconController__factory(signer),
      [],
    );

    const router = await this.deployProxiedContract(
      network,
      'Yo',
      new Yo__factory(signer),
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

  mustGetRouter(network: Networks, addresses: YoAddresses) {
    return Yo__factory.connect(
      addresses.router.proxy,
      this.multiProvider.getDomainConnection(network).signer!,
    );
  }
}
