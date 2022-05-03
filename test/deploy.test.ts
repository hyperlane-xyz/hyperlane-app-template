import path from 'path';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { utils } from '@abacus-network/deploy';

import { PingPongAddresses } from '../src';
import { PingPongDeployer  } from '../src/deploy';
import { configs } from '../src/deploy/networks';

describe('deploy', async () => {
  let deployer: PingPongDeployer<"test1" | "test2">
  let addresses: Record<"test1" | "test2", PingPongAddresses>

  before(async () => {
    const transactionConfigs = {
      test1: configs.test1,
      test2: configs.test2,
    };
    const [signer] = await ethers.getSigners();
    const multiProvider = utils.initHardhatMultiProvider({ transactionConfigs }, signer);
    deployer = new PingPongDeployer(multiProvider, utils.getTestConnectionManagers(multiProvider));
  });

  it('deploys', async () => {
    addresses = await deployer.deploy();
  });

  it('writes', async () => {
    const base = './test/outputs/pingPong';
    deployer.writeVerification(path.join(base, 'verification'));
    deployer.writeContracts(addresses, path.join(base, 'contracts.ts'));
  });

  // it('checks', async () => {
  //   const app = new PingPongApp(deployer.addressesRecord);
  //   const [signer] = await ethers.getSigners();
  //   utils.registerHardhatEnvironment(app, environment, signer);
  //   const checker = new PingPongChecker(app, environment.config);
  //   await checker.check(signer.address);
  // });
});
