import { AbacusApp, ChainMap, ChainName, ChainNameToDomainId, MultiProvider } from '@abacus-network/sdk';
import { ethers } from 'ethers';
import {
  PingPongAddresses,
  PingPongContracts,
} from './contracts';
import { environments } from './environments';

type Environments = typeof environments;
type EnvironmentName = keyof Environments;

export class PingPongApp<
  Networks extends ChainName = ChainName,
> extends AbacusApp<PingPongContracts, Networks> {
  constructor(
    networkAddresses: ChainMap<Networks, PingPongAddresses>,
    multiProvider: MultiProvider<Networks>,
  ) {
    super(PingPongContracts, networkAddresses, multiProvider);
  }

  static fromEnvironment(
    name: EnvironmentName,
    multiProvider: MultiProvider<keyof Environments[typeof name]>,
  ) {
    return new PingPongApp(environments[name], multiProvider);
  }

  async pingRemote(
    from: Networks,
    to: Networks,
  ): Promise<ethers.ContractReceipt> {
    const router = this.getContracts(from).router;
    const toDomain = ChainNameToDomainId[to];
    const tx = await router.pingRemote(toDomain);
    return tx.wait();
  }
}
