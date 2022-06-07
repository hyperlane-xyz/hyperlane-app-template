import { utils } from '@abacus-network/deploy';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import path from 'path';
import { helloWorldFactories } from '../../sdk/contracts';
import { getConfigMap, testConfigs } from '../config';
import { HelloWorldDeployer } from '../deploy';
import { writeContracts } from './utils';

async function main() {
  const [signer] = await ethers.getSigners();
  const environment = 'test';
  const multiProvider = utils.getMultiProviderFromConfigAndSigner(
    testConfigs,
    signer,
  );
  const deployer = new HelloWorldDeployer(
    multiProvider,
    getConfigMap(signer.address),
    helloWorldFactories,
  );
  const chainToContracts = await deployer.deploy();
  writeContracts(
    chainToContracts,
    path.join('./src/sdk/environments/', environment + '.ts'),
  );
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
