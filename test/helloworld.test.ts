import { utils } from '@abacus-network/deploy';
import '@abacus-network/hardhat';
// TODO export TestCoreApp from @abacus-network/hardhat properly
import { TestCoreApp } from '@abacus-network/hardhat/dist/src/TestCoreApp';
// TODO export TestCoreDeploy from @abacus-network/hardhat properly
import { TestCoreDeploy } from '@abacus-network/hardhat/dist/src/TestCoreDeploy';
import { ChainNameToDomainId } from '@abacus-network/sdk';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { getConfigMap, testConfigs } from '../src/deploy/config';
import { HelloWorldDeployer } from '../src/deploy/deploy';
import { helloWorldFactories } from '../src/sdk/contracts';
import { HelloWorld } from '../src/types';

describe('HelloWorld', async () => {
  const localChain = 'test1';
  const remoteChain = 'test2';
  const localDomain = ChainNameToDomainId[localChain];
  const remoteDomain = ChainNameToDomainId[remoteChain];

  let signer: SignerWithAddress;
  let local: HelloWorld;
  let remote: HelloWorld;
  // TODO fix multiProvider type issues
  let multiProvider: any; /*MultiProvider<TestChainNames>;*/
  let coreApp: TestCoreApp;

  before(async () => {
    [signer] = await ethers.getSigners();

    multiProvider = utils.getMultiProviderFromConfigAndSigner(
      testConfigs,
      signer,
    );

    const coreDeployer = new TestCoreDeploy(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    coreApp = new TestCoreApp(coreContractsMaps, multiProvider);
  });

  beforeEach(async () => {
    const config = getConfigMap(signer.address);
    const helloWorld = new HelloWorldDeployer(
      multiProvider,
      config,
      helloWorldFactories,
      coreApp,
    );
    const contracts = await helloWorld.deploy();

    local = contracts[localChain].router;
    remote = contracts[remoteChain].router;

    expect(await local.sent()).to.equal(0);
    expect(await local.received()).to.equal(0);
    expect(await remote.sent()).to.equal(0);
    expect(await remote.received()).to.equal(0);
  });

  it('sends a message', async () => {
    // Using outbox.contract instead of outbox because it's a proxy
    const outbox = coreApp.getContracts(localChain).outbox.contract;
    await expect(local.sendHelloWorld(remoteDomain, 'Hello')).to.emit(
      outbox,
      'Dispatch',
    );
    expect(await local.sent()).to.equal(1);
    expect(await local.sentTo(remoteDomain)).to.equal(1);
    expect(await local.received()).to.equal(0);
  });

  // it('pays interchain gas', async () => {
  //   const gasPayment = BigNumber.from('1000');
  //   const interchainGasPaymaster =
  //     coreApp.getContracts(localChain).interchainGasPaymaster;
  //   await expect(
  //     local.sendHelloWorld(remoteDomain, 'World', {
  //       value: gasPayment,
  //     }),
  //   ).to.emit(interchainGasPaymaster, 'GasPayment');
  // });

  it('handles a message', async () => {
    await local.sendHelloWorld(remoteDomain, 'World');
    // Mock processing of the message by Abacus
    await coreApp.processOutboundMessages(localChain);
    // The initial message has been dispatched.
    expect(await local.sent()).to.equal(1);
    // The initial message has been processed.
    expect(await remote.received()).to.equal(1);
    expect(await remote.receivedFrom(localDomain)).to.equal(1);

    // TODO test for event from handler
  });
});
