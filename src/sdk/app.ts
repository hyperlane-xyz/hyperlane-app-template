import {
  AbacusApp,
  AbacusCore,
  ChainMap,
  ChainName,
  ChainNameToDomainId,
  InterchainGasCalculator,
  MultiProvider,
} from '@abacus-network/sdk';
import { BigNumber, ethers } from 'ethers';
import { HelloWorldContracts } from './contracts';

export class HelloWorldApp<
  Chain extends ChainName = ChainName,
> extends AbacusApp<HelloWorldContracts, Chain> {
  constructor(
    contractsMap: ChainMap<Chain, HelloWorldContracts>,
    multiProvider: MultiProvider<Chain>,
    public interchainGasCalculator: InterchainGasCalculator<Chain>,
  ) {
    super(contractsMap, multiProvider);
  }

  static fromContractsMap<Chain extends ChainName = ChainName>(
    contractsMap: ChainMap<Chain, HelloWorldContracts>,
    multiProvider: MultiProvider<Chain>,
    core: AbacusCore<Chain>,
  ) {
    const interchainGasCalculator = new InterchainGasCalculator(
      multiProvider as MultiProvider<Chain>,
      core as AbacusCore<Chain>,
    );
    return new HelloWorldApp(
      contractsMap,
      multiProvider,
      interchainGasCalculator,
    );
  }

  async sendHelloWorld(
    from: Chain,
    to: Chain,
    message: string,
  ): Promise<ethers.ContractReceipt> {
    const helloWorldContract = this.getContracts(from).router;

    const toDomain = ChainNameToDomainId[to];

    const interchainGasPayment =
      await this.interchainGasCalculator.estimatePaymentForHandleGasAmount(
        // @ts-ignore TODO Exclude<> type in IGC is incorrect
        from,
        to,
        // Actual gas costs depend on the size of the message
        BigNumber.from('100000'),
      );
    const tx = await helloWorldContract.sendHelloWorld(toDomain, message, {
      value: interchainGasPayment,
    });
    return tx.wait();
  }
}
