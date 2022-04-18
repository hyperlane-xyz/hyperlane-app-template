import { AbacusRouterDeployer, RouterConfig } from '@abacus-network/deploy';
import { ChainName } from '@abacus-network/sdk';
import { types } from '@abacus-network/utils';
import { PingPongContractAddresses } from '../sdk';
import { PingPong, PingPong__factory } from '../types';

export class PingPongDeployer extends AbacusRouterDeployer<
  PingPongContractAddresses,
  RouterConfig<ChainName>
> {
  async deployContracts(
    domain: types.Domain,
    config: RouterConfig<ChainName>,
  ): Promise<PingPongContractAddresses> {
    const xAppConnectionManager =
      await this.deployConnectionManagerIfNotConfigured(domain, config);

    const signer = this.mustGetSigner(domain);
    const router = await this.deployContract(
      domain,
      'PingPong',
      new PingPong__factory(signer),
      [xAppConnectionManager.address],
    );

    return {
      router: router.address,
      xAppConnectionManager: xAppConnectionManager.address,
    };
  }

  mustGetRouter(domain: number): PingPong {
    return PingPong__factory.connect(
      this.mustGetAddresses(domain).router,
      this.mustGetSigner(domain),
    );
  }
}
