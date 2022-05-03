import path from 'path';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { utils } from '@abacus-network/deploy';

import { PingPongAddresses, PingPongApp } from '../src';
import { PingPongChecker, PingPongDeployer  } from '../src/deploy';
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

  it('checks', async () => {
    const transactionConfigs = {
      test1: configs.test1,
      test2: configs.test2,
    };
    const [signer] = await ethers.getSigners();
    const multiProvider = utils.initHardhatMultiProvider({ transactionConfigs }, signer);
    const app = new PingPongApp(addresses, multiProvider);
    const checker = new PingPongChecker(multiProvider, app, {})
    await checker.check({ test1: signer.address, test2: signer.address})
    checker.expectEmpty()
  });
});
