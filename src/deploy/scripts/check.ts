import { utils } from '@abacus-network/deploy';
import { buildContracts, ChainMap, ChainName } from '@abacus-network/sdk';
import { ethers } from 'hardhat';
import { HelloWorldApp } from '../../sdk/app';
import { HelloWorldContracts, helloWorldFactories } from '../../sdk/contracts';
import { addresses } from '../../sdk/environments/test';
import { HelloWorldChecker } from '../check';
import { getConfigMap, testConfigs } from '../config';

async function check() {
  const [signer] = await ethers.getSigners();
  const multiProvider = utils.getMultiProviderFromConfigAndSigner(
    testConfigs,
    signer,
  );

  const contractsMap = buildContracts(
    addresses,
    helloWorldFactories,
  ) as ChainMap<ChainName, HelloWorldContracts>;
  const app = new HelloWorldApp(contractsMap, multiProvider);

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
