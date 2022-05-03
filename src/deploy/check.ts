import { AbacusRouterChecker } from '@abacus-network/deploy';
import { ChainName } from '@abacus-network/sdk';
import { types } from '@abacus-network/utils';
import { PingPongApp } from '../sdk';
import { PingPongConfig } from '../sdk/types';

export class PingPongChecker<
  Networks extends ChainName,
> extends AbacusRouterChecker<
  Networks,
  PingPongApp<Networks>,
  PingPongConfig<Networks>
> {
  async checkDomainAddresses(
    network: Networks,
    owner: types.Address,
  ): Promise<void> {
    await super.checkDomain(network, owner);
  }

  mustGetRouter(network: Networks) {
    return this.app.getContracts(network).router;
  }
}
