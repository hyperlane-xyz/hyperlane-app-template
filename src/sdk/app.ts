import {
  AbacusApp,
  ChainName,
  ChainNameToDomainId,
  Remotes,
} from '@abacus-network/sdk';
import { ethers } from 'ethers';
import { HelloWorldContracts } from './contracts';

export class HelloWorldApp<
  Chain extends ChainName = ChainName,
> extends AbacusApp<HelloWorldContracts, Chain> {
  async sendHelloWorld<From extends Chain>(
    from: From,
    to: Remotes<Chain, From>,
    message: string,
  ): Promise<ethers.ContractReceipt> {
    const helloWorldContract = this.getContracts(from).router;
    const toDomain = ChainNameToDomainId[to];
    const tx = await helloWorldContract.sendHelloWorld(toDomain, message);
    return tx.wait();
  }

  async channelStats<From extends Chain>(from: From, to: Remotes<Chain, From>) {
    const sent = await this.getContracts(from).router.sentTo(
      ChainNameToDomainId[to],
    );
    const received = await this.getContracts(to).router.receivedFrom(
      ChainNameToDomainId[from],
    );
    return { sent, received };
  }

  async stats() {
    const entries = await Promise.all(
      this.chains().map(async (source) => {
        const destinationEntries = await Promise.all(
          this.remoteChains(source).map(async (destination) => [
            destination,
            await this.channelStats(source, destination),
          ]),
        );
        return [source, Object.fromEntries(destinationEntries)];
      }),
    );
    return Object.fromEntries(entries);
  }
}
