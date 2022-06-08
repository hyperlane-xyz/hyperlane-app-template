import { utils } from '@abacus-network/deploy';
import {
  AbacusCore,
  buildContracts,
  ChainMap,
  ChainName,
  InterchainGasCalculator,
} from '@abacus-network/sdk';
import { ethers } from 'hardhat';
import { HelloWorldApp } from '../../sdk/app';
import { HelloWorldContracts, helloWorldFactories } from '../../sdk/contracts';
import { HelloWorldChecker } from '../check';
import { getConfigMap, testConfigs } from '../config';
import { addresses } from '../../sdk/environments/test';

async function check() {
  const [signer] = await ethers.getSigners();
  // @ts-ignore TODO fix multiProvider type issues
  const multiProvider = utils.getMultiProviderFromConfigAndSigner(
    testConfigs,
    signer,
  ) as any;

  const contractsMap = buildContracts(
    addresses,
    helloWorldFactories,
  ) as ChainMap<ChainName, HelloWorldContracts>;

  const core = AbacusCore.fromEnvironment('test', multiProvider);
  const interchainGasCalculator = new InterchainGasCalculator(
    multiProvider,
    core,
  );
  const app = new HelloWorldApp(
    contractsMap,
    multiProvider,
    interchainGasCalculator,
  );

  const helloWorldChecker = new HelloWorldChecker(
    multiProvider,
    app,
    getConfigMap(signer.address),
  );
  await helloWorldChecker.check();
  helloWorldChecker.expectEmpty();
}

check()
  .then(() => console.info('Check complete'))
  .catch(console.error);
