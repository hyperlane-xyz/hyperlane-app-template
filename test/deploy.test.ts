import path from 'path';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { utils } from '@abacus-network/deploy';

import { getConfigMap, testConfigs, TestNetworks } from '../src/deploy/config';
import {
  AbacusCore,
  buildContracts,
  ChainMap,
  ChainName,
  InterchainGasCalculator,
} from '@abacus-network/sdk';
import { HelloWorldApp } from '../src/sdk/app';
import { HelloWorldDeployer } from '../src/deploy/deploy';
import { HelloWorldChecker } from '../src/deploy/check';
import { HelloWorldContracts, helloWorldFactories } from '../src/sdk/contracts';
import { writeContracts, writeVerification } from '../src/deploy/scripts/utils';
import { addresses } from '../src/sdk/environments/test';

describe('deploy', async () => {
  let deployer: HelloWorldDeployer<TestNetworks>;
  let contracts: Record<TestNetworks, HelloWorldContracts>;

  before(async () => {
    const transactionConfigs = {
      test1: testConfigs.test1,
      test2: testConfigs.test2,
      test3: testConfigs.test3,
    };
    const [signer] = await ethers.getSigners();
    const multiProvider = utils.getMultiProviderFromConfigAndSigner(
      transactionConfigs,
      signer,
    );
    // @ts-ignore TODO fix multiProvider type issues
    deployer = new HelloWorldDeployer(
      multiProvider,
      getConfigMap(signer.address),
      helloWorldFactories,
    );
  });

  it('deploys', async () => {
    contracts = await deployer.deploy();
  });

  it('writes', async () => {
    const base = './test/outputs/helloWorld';
    writeVerification(
      deployer.verificationInputs,
      path.join(base, 'verification'),
    );
    writeContracts(contracts, path.join(base, 'contracts.ts'));
  });

  it('checks', async () => {
    const transactionConfigs = {
      test1: testConfigs.test1,
      test2: testConfigs.test2,
      test3: testConfigs.test3,
    };
    const [signer] = await ethers.getSigners();
    const multiProvider = utils.getMultiProviderFromConfigAndSigner(
      transactionConfigs,
      signer,
    );

    const contractsMap = buildContracts(
      addresses,
      helloWorldFactories,
    ) as ChainMap<ChainName, HelloWorldContracts>;
    // @ts-ignore TODO fix fromEnvironment param type
    const core = AbacusCore.fromEnvironment('test', multiProvider);
    const interchainGasCalculator = new InterchainGasCalculator(
      // @ts-ignore TODO fix multiProvider type issues
      multiProvider,
      core,
    );
    const app = new HelloWorldApp(
      contractsMap,
      // @ts-ignore TODO fix multiProvider type issues
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
