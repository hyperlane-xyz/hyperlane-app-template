import { ethers} from 'ethers'
import {
  AbacusApp,
  ChainName,
  domains,
  NameOrDomain
} from '@abacus-network/sdk';

import { PingPongContractAddresses, PingPongContracts } from './contracts';

export class PingPongApp extends AbacusApp<
  PingPongContractAddresses,
  PingPongContracts
> {
  constructor(addresses: Partial<Record<ChainName, PingPongContractAddresses>>) {
    super();
    const chains = Object.keys(addresses) as ChainName[];
    chains.map((chain) => {
      this.registerDomain(domains[chain]);
      const domain = this.resolveDomain(chain);
      this.contracts.set(domain, new PingPongContracts(addresses[chain]!));
    });
  }

  async pingRemote(
    from: NameOrDomain,
    to: NameOrDomain,
    overrides: ethers.Overrides = {},
  ): Promise<ethers.ContractReceipt> {
    const router = this.mustGetContracts(from).router;
    const toDomain = this.resolveDomain(to);
    const tx = await router.pingRemote(toDomain);
    return tx.wait();
  }
}
