import { utils } from '@abacus-network/deploy';
import { TestCoreApp } from '@abacus-network/hardhat/dist/src/TestCoreApp';
import { serializeContracts } from '@abacus-network/sdk';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { getConfigMap, testConfigs } from '../deploy/config';
import { HelloWorldDeployer } from '../deploy/deploy';
import { helloWorldFactories } from '../sdk/contracts';

async function main() {
  const [signer] = await ethers.getSigners();
  const multiProvider = utils.getMultiProviderFromConfigAndSigner(
    testConfigs,
    signer,
  );

  const core = TestCoreApp.fromEnvironment('test', multiProvider);

  const deployer = new HelloWorldDeployer(
    multiProvider,
    getConfigMap(signer.address),
    helloWorldFactories,
    core,
  );
  const chainToContracts = await deployer.deploy();
  const addresses = serializeContracts(chainToContracts);
  console.info('===Contract Addresses===');
  console.info(JSON.stringify(addresses));
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
