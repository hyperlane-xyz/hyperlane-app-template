import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';

import {
  ChainMap,
  ChainNameToDomainId,
  MultiProvider,
  TestChainNames,
  TestCoreApp,
  TestCoreDeployer,
  getChainToOwnerMap,
  getTestMultiProvider,
  testChainConnectionConfigs,
} from '@hyperlane-xyz/sdk';

import { HelloWorldConfig } from '../deploy/config';
import { HelloWorldDeployer } from '../deploy/deploy';
import {
  HelloWorld,
  IInterchainGasPaymaster,
  IInterchainGasPaymaster__factory,
} from '../types';

describe('HelloWorld', async () => {
  const localChain = 'test1';
  const remoteChain = 'test2';
  const localDomain = ChainNameToDomainId[localChain];
  const remoteDomain = ChainNameToDomainId[remoteChain];
  const handleGasAmount = 100_000;

  let signer: SignerWithAddress;
  let local: HelloWorld;
  let remote: HelloWorld;
  let localIgp: IInterchainGasPaymaster;
  let multiProvider: MultiProvider<TestChainNames>;
  let coreApp: TestCoreApp;
  let config: ChainMap<TestChainNames, HelloWorldConfig>;

  before(async () => {
    [signer] = await ethers.getSigners();

    multiProvider = getTestMultiProvider(signer);

    const coreDeployer = new TestCoreDeployer(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    coreApp = new TestCoreApp(coreContractsMaps, multiProvider);
    config = coreApp.extendWithConnectionClientConfig(
      getChainToOwnerMap(testChainConnectionConfigs, signer.address),
    );
  });

  beforeEach(async () => {
    const helloWorld = new HelloWorldDeployer(multiProvider, config, coreApp);
    const contracts = await helloWorld.deploy();

    local = contracts[localChain].router;
    remote = contracts[remoteChain].router;
    localIgp = IInterchainGasPaymaster__factory.connect(
      config[localChain].interchainGasPaymaster,
      multiProvider.getChainProvider(localChain),
    );

    // The all counts start empty
    expect(await local.sent()).to.equal(0);
    expect(await local.received()).to.equal(0);
    expect(await remote.sent()).to.equal(0);
    expect(await remote.received()).to.equal(0);
  });

  async function quoteGasPayment(
    fromRouter: HelloWorld,
    destinationDomain: number,
    igp: IInterchainGasPaymaster,
  ) {
    const handleGasAmount = await fromRouter.handleGasAmounts(
      destinationDomain,
    );
    return igp.quoteGasPayment(destinationDomain, handleGasAmount);
  }

  it('sends a message', async () => {
    await expect(
      local.sendHelloWorld(remoteDomain, 'Hello', {
        value: await quoteGasPayment(local, remoteDomain, localIgp),
      }),
    ).to.emit(local, 'SentHelloWorld');
    // The sent counts are correct
    expect(await local.sent()).to.equal(1);
    expect(await local.sentTo(remoteDomain)).to.equal(1);
    // The received counts are correct
    expect(await local.received()).to.equal(0);
  });

  it('reverts if there is insufficient payment', async () => {
    await expect(
      local.sendHelloWorld(remoteDomain, 'Hello', {
        value: 0,
      }),
    ).to.be.revertedWith('insufficient interchain gas payment');
  });

  it('handles a message', async () => {
    await local.sendHelloWorld(remoteDomain, 'World', {
      value: await quoteGasPayment(local, remoteDomain, localIgp),
    });
    // Mock processing of the message by Hyperlane
    await coreApp.processOutboundMessages(localChain);
    // The initial message has been dispatched.
    expect(await local.sent()).to.equal(1);
    // The initial message has been processed.
    expect(await remote.received()).to.equal(1);
    expect(await remote.receivedFrom(localDomain)).to.equal(1);
  });

  describe('setHandleGasAmount', () => {
    it('sets the handle gas amount', async () => {
      expect(await local.handleGasAmounts(remoteDomain)).to.equal(0);

      await expect(local.setHandleGasAmount(remoteDomain, handleGasAmount))
        .to.emit(local, 'HandleGasAmountSet')
        .withArgs(remoteDomain, handleGasAmount);

      expect(await local.handleGasAmounts(remoteDomain)).to.equal(
        handleGasAmount,
      );
    });

    it('reverts if called by a non-owner', async () => {
      const [, nonOwner] = await ethers.getSigners();
      const localNonOwner = local.connect(nonOwner);
      await expect(
        localNonOwner.setHandleGasAmount(remoteDomain, handleGasAmount),
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });
  });
});
