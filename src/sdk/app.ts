import { AbacusApp, NameOrDomain } from '@abacus-network/sdk';
import { ethers } from 'ethers';
import { TemplateNetworks } from '../deploy/networks';
import { PingPongContractAddresses, PingPongContracts } from './contracts';

export class PingPongApp extends AbacusApp<
  TemplateNetworks,
  PingPongContractAddresses,
  PingPongContracts
> {
  buildContracts(addresses: PingPongContractAddresses): PingPongContracts {
    return new PingPongContracts(addresses);
  }

  async pingRemote(
    from: NameOrDomain,
    to: NameOrDomain,
  ): Promise<ethers.ContractReceipt> {
    const router = this.mustGetContracts(from).router;
    const toDomain = this.resolveDomain(to);
    const tx = await router.pingRemote(toDomain);
    return tx.wait();
  }
}
