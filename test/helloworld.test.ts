import { ethers, abacus } from 'hardhat';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { HelloWorld } from '../src/types';
import { BigNumber } from 'ethers';
import { HelloWorldDeployer } from '../src/deploy/deploy';
import { localTestConfigs } from './config';
import { utils } from '@abacus-network/deploy';
import { getConfigMap, TestNetworks } from '../src/deploy/config';
import { helloWorldFactories } from '../src/sdk/contracts';

const localDomain = 1000;
const remoteDomain = 2000;
// const domains = [localDomain, remoteDomain];

describe('HelloWorld', async () => {
  let signer: SignerWithAddress,
    router: HelloWorld,
    remote: HelloWorld,
    helloWorld: HelloWorldDeployer<TestNetworks>;

  before(async () => {
    [signer] = await ethers.getSigners();
    await abacus.deploy();
  });

  beforeEach(async () => {
    const multiProvider = utils.getMultiProviderFromConfigAndSigner(
      localTestConfigs,
      signer,
    );
    // @ts-ignore TODO fix multiProvider type issues
    helloWorld = new HelloWorldDeployer(
      multiProvider,
      getConfigMap(signer.address),
      helloWorldFactories,
    );
    const contracts = await helloWorld.deploy();
    router = contracts['test1'].router;
    remote = contracts['test2'].router;
    // router = helloWorld.router(localDomain);
    // remote = helloWorld.router(remoteDomain);
    expect(await router.sent()).to.equal(0);
    expect(await router.received()).to.equal(0);
    // TODO re-enable these
    // expect(await remote.sent()).to.equal(0);
    // expect(await remote.received()).to.equal(0);
  });

  it('sends a message', async () => {
    await expect(router.sendHelloWorld(remoteDomain, 'Hello')).to.emit(
      abacus.outbox(localDomain),
      'Dispatch',
    );
    expect(await router.sent()).to.equal(1);
    expect(await router.sentTo(remoteDomain)).to.equal(1);
    expect(await router.received()).to.equal(0);
  });

  it('pays interchain gas', async () => {
    const gasPayment = BigNumber.from('1000');
    await expect(
      router.sendHelloWorld(remoteDomain, 'World', {
        value: gasPayment,
      }),
    ).to.emit(abacus.interchainGasPaymaster(localDomain), 'GasPayment');
  });

  it('handles a message', async () => {
    await router.sendHelloWorld(remoteDomain, 'World');
    // Mock processing of the message by Abacus
    await abacus.processOutboundMessages(localDomain);
    // The initial message has been dispatched.
    expect(await router.sent()).to.equal(1);
    // The initial message has been processed.
    expect(await remote.received()).to.equal(1);
    expect(await remote.receivedFrom(localDomain)).to.equal(1);
  });
});
