import { types } from '@abacus-network/utils';
import { AbacusRouterDeployer, RouterConfig } from '@abacus-network/deploy';
import { PingPong, PingPong__factory } from '../types';
import { PingPongContractAddresses } from '../sdk';

export class PingPongDeployer extends AbacusRouterDeployer<
  PingPongContractAddresses,
  RouterConfig
> {
  async deployContracts(
    domain: types.Domain,
    config: RouterConfig,
  ): Promise<PingPongContractAddresses> {
    const xAppConnectionManager =
      await this.deployConnectionManagerIfNotConfigured(domain, config);

    const signer = this.mustGetSigner(domain);
    const router = await this.deployContract(
      domain,
      'PingPong',
      new PingPong__factory(signer),
      xAppConnectionManager.address,
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
