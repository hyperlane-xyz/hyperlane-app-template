import path from 'path';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { utils } from '@abacus-network/deploy';

import { PingPongApp } from '../src';
import { PingPongDeployer, PingPongChecker } from '../src/deploy';
import { environment } from '../src/deploy/environments/test';

describe('deploy', async () => {
  const deployer = new PingPongDeployer();

  before(async () => {
    const [signer] = await ethers.getSigners();
    utils.registerHardhatEnvironment(deployer, environment, signer);
    environment.config.xAppConnectionManager =
      utils.getTestConnectionManagers(deployer);
  });

  it('deploys', async () => {
    await deployer.deploy(environment.config);
  });

  it('writes', async () => {
    const base = './test/outputs/pingPong';
    deployer.writeVerification(path.join(base, 'verification'));
    deployer.writeContracts(path.join(base, 'contracts.ts'));
  });

  it('checks', async () => {
    const app = new PingPongApp(deployer.addressesRecord);
    const [signer] = await ethers.getSigners();
    utils.registerHardhatEnvironment(app, environment, signer);
    const checker = new PingPongChecker(app, environment.config);
    await checker.check(signer.address);
  });
});
