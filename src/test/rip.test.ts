import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
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
  RouterConfig,
} from '@abacus-network/sdk';

import { RemoteIdentityProxyRouterDeployer } from '../deploy/RipDeployer';
import { RemoteIdentityProxyRouter, TestRecipient__factory } from '../types';
import { expect } from 'chai';
import { addressToBytes32 } from '@abacus-network/utils/dist/src/utils';

describe('RemoteIdentityProxyRouter', async () => {
  const localChain = 'test1';
  const remoteChain = 'test2';
  const localDomain = ChainNameToDomainId[localChain];
  const remoteDomain = ChainNameToDomainId[remoteChain];

  let signer: SignerWithAddress;
  let local: RemoteIdentityProxyRouter;
  let remote: RemoteIdentityProxyRouter;
  let multiProvider: MultiProvider<TestChainNames>;
  let coreApp: TestCoreApp;
  let config: ChainMap<TestChainNames, RouterConfig>;

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
    const helloWorld = new RemoteIdentityProxyRouterDeployer(multiProvider, config, coreApp);
    const contracts = await helloWorld.deploy();

    local = contracts[localChain].router;
    remote = contracts[remoteChain].router;

    // The all counts start empty
  });

  it.only('sends a message', async () => {
    console.log('ignore', !!localDomain, !!remote)
    const recipientF = new TestRecipient__factory(signer)
    const recipient = await recipientF.deploy()
    const data = (await recipient.populateTransaction.foo('0x12')).data!
    await local.dispatch(remoteDomain, [{ to: recipient.address, data }])
    const ripAddress = await remote.getRIPAddress(localDomain, addressToBytes32(signer.address))
    await coreApp.processMessages()
    expect(await recipient.lastData()).to.eql('0x12')
    expect(await recipient.lastSender()).to.eql(ripAddress)
  })
});
