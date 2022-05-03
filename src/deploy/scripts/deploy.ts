import { utils } from '@abacus-network/deploy';
import "@nomiclabs/hardhat-ethers";
import { ethers } from 'hardhat';
import path from 'path';
import { PingPongDeployer } from '..';
import { configs } from '../networks';

async function main() {
  const transactionConfigs = {
    alfajores: configs.alfajores,
    kovan: configs.kovan,
  };
  const [signer] = await ethers.getSigners();
  const environment = 'test';
  const multiProvider = utils.initHardhatMultiProvider({ transactionConfigs }, signer);
  // const core = AbacusCore.fromEnvironment('test', multiProvider);
  
  const deployer = new PingPongDeployer(multiProvider, {}) ;
  const addresses = await deployer.deploy();
  deployer.writeContracts(addresses, path.join('./src/deploy/output/', environment));
}

main().then(console.log).catch(console.error);
