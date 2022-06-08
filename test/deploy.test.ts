import { utils } from '@abacus-network/deploy';
// TODO export TestCoreApp from @abacus-network/hardhat properly
import { TestCoreApp } from '@abacus-network/hardhat/dist/src/TestCoreApp';
// TODO export TestCoreDeploy from @abacus-network/hardhat properly
import { TestCoreDeploy } from '@abacus-network/hardhat/dist/src/TestCoreDeploy';
import { MultiProvider, TestChainNames } from '@abacus-network/sdk';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { HelloWorldChecker } from '../src/deploy/check';
import { getConfigMap, testConfigs } from '../src/deploy/config';
import { HelloWorldDeployer } from '../src/deploy/deploy';
import { HelloWorldApp } from '../src/sdk/app';
import { HelloWorldContracts, helloWorldFactories } from '../src/sdk/contracts';

describe('deploy', async () => {
  let multiProvider: MultiProvider<TestChainNames>;
  let core: TestCoreApp;
  let deployer: HelloWorldDeployer<TestChainNames>;
  let contracts: Record<TestChainNames, HelloWorldContracts>;
  let app: HelloWorldApp<TestChainNames>;

  before(async () => {
    const [signer] = await ethers.getSigners();
    multiProvider = utils.getMultiProviderFromConfigAndSigner(
      testConfigs,
      signer,
    );

    const coreDeployer = new TestCoreDeploy(multiProvider);
    const coreContractsMaps = await coreDeployer.deploy();
    core = new TestCoreApp(coreContractsMaps, multiProvider);

    deployer = new HelloWorldDeployer(
      multiProvider,
      getConfigMap(signer.address),
      helloWorldFactories,
      core,
    );
  });

  it('deploys', async () => {
    contracts = await deployer.deploy();
  });

  it('builds app', async () => {
    contracts = await deployer.deploy();
    app = new HelloWorldApp(contracts, multiProvider);
  });

  it('checks', async () => {
    const [signer] = await ethers.getSigners();

    const checker = new HelloWorldChecker(
      multiProvider,
      app,
      getConfigMap(signer.address),
    );
    await checker.check();
    checker.expectEmpty();
  });
});
