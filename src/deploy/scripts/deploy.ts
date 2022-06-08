import { utils } from '@abacus-network/deploy';
import '@nomiclabs/hardhat-ethers';
import { ethers } from 'hardhat';
import { helloWorldFactories } from '../../sdk/contracts';
import { getConfigMap, testConfigs } from '../config';
import { HelloWorldDeployer } from '../deploy';
import { extractContractAddresses } from './utils';

async function main() {
  const [signer] = await ethers.getSigners();
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
  const addresses = extractContractAddresses(chainToContracts);
  console.info('===Contract Addresses===');
  console.info(JSON.stringify(addresses));
}

main()
  .then(() => console.info('Deploy complete'))
  .catch(console.error);
