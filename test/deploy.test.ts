import { utils } from '@abacus-network/deploy';
// TODO export TestCoreApp from @abacus-network/hardhat properly
import { TestCoreApp } from '@abacus-network/hardhat/dist/src/TestCoreApp';
// TODO export TestCoreDeploy from @abacus-network/hardhat properly
import { TestCoreDeploy } from '@abacus-network/hardhat/dist/src/TestCoreDeploy';
import { InterchainGasCalculator, TestChainNames } from '@abacus-network/sdk';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { HelloWorldChecker } from '../src/deploy/check';
import { getConfigMap, testConfigs } from '../src/deploy/config';
import { HelloWorldDeployer } from '../src/deploy/deploy';
import { HelloWorldApp } from '../src/sdk/app';
import { HelloWorldContracts, helloWorldFactories } from '../src/sdk/contracts';

describe('deploy', async () => {
  let deployer: HelloWorldDeployer<TestChainNames>;
  let contracts: Record<TestChainNames, HelloWorldContracts>;

  before(async () => {
    const [signer] = await ethers.getSigners();
    const multiProvider = utils.getMultiProviderFromConfigAndSigner(
      testConfigs,
      signer,
    );
    deployer = new HelloWorldDeployer(
      multiProvider,
      getConfigMap(signer.address),
      helloWorldFactories,
    );
  });

  it('deploys', async () => {
    contracts = await deployer.deploy();
  });

  it('checks', async () => {
    const [signer] = await ethers.getSigners();

    // TODO fix multiProvider type issues
    const multiProvider = utils.getMultiProviderFromConfigAndSigner(
      testConfigs,
      signer,
    ) as any;

    const coreDeployer = new TestCoreDeploy(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    const coreApp = new TestCoreApp(coreContractsMaps, multiProvider);

    const interchainGasCalculator = new InterchainGasCalculator(
      multiProvider,
      // @ts-ignore TODO fix MultiGeneric type issue
      coreApp,
    );

    const app = new HelloWorldApp(
      contracts,
      multiProvider,
      interchainGasCalculator,
    );

    const checker = new HelloWorldChecker(
      multiProvider,
      app,
      getConfigMap(signer.address),
    );
    await checker.check();
    checker.expectEmpty();
  });
});
