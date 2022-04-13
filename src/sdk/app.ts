import { ethers } from 'ethers';
import {
  AbacusApp,
  ChainName,
  domains,
  NameOrDomain,
} from '@abacus-network/sdk';

import { PingPongContractAddresses, PingPongContracts } from './contracts';
import { addresses } from './environments';

export class PingPongApp extends AbacusApp<
  PingPongContractAddresses,
  PingPongContracts
> {
  constructor(
    addressesOrEnv:
      | Partial<Record<ChainName, PingPongContractAddresses>>
      | string,
  ) {
    super();
    let _addresses: Partial<Record<ChainName, PingPongContractAddresses>> = {};
    if (typeof addressesOrEnv == 'string') {
      _addresses = addresses[addressesOrEnv];
      if (!_addresses)
        throw new Error(
          `addresses for environment ${addressesOrEnv} not found`,
        );
    } else {
      _addresses = addressesOrEnv;
    }
    const chains = Object.keys(_addresses) as ChainName[];
    chains.map((chain) => {
      this.registerDomain(domains[chain]);
      const domain = this.resolveDomain(chain);
      this.contracts.set(domain, new PingPongContracts(_addresses[chain]!));
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
