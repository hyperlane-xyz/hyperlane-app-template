import path from 'path';
import '@nomiclabs/hardhat-waffle';
import { ethers } from 'hardhat';
import { types } from '@abacus-network/utils';
import { PingPongApp } from '../src';

import { PingPongDeployer, PingPongChecker } from '../src/deploy';

import {
  test,
} from '../src/deploy/environments';
import { registerHardhatEnvironment, RouterConfig } from '@abacus-network/deploy';

describe('deploy', async () => {
  const deployer = new PingPongDeployer();
  const owners: Record<types.Domain, types.Address> = {};
  let pingPong: PingPongApp;
  let config: RouterConfig;

  before(async () => {
    const [signer, owner] = await ethers.getSigners();
    registerHardhatEnvironment(deployer, test, signer);

    deployer.domainNumbers.map((domain) => {
      owners[domain] = owner.address;
    });

    // Setting for connection manager can be anything for a test deployment.
    if (!config.xAppConnectionManager) {
      config.xAppConnectionManager = {};
      deployer.domainNumbers.map((domain) => {
        const name = deployer.mustResolveDomainName(domain);
        config.xAppConnectionManager![name] = signer.address;
      });
    }
  });

  it('deploys', async () => {
    await deployer.deploy(config);
  });

  it('writes', async () => {
    const base = './test/outputs/pingPong';
    deployer.writeVerification(path.join(base, 'verification'));
    deployer.writeContracts(path.join(base, 'contracts.ts'));
  });

  it('checks', async () => {
    const app = new PingPongApp(deployer.addressesRecord);
    const [signer] = await ethers.getSigners();
    registerHardhatEnvironment(app, test, signer);
    const checker = new PingPongChecker(pingPong, config);
    await checker.check(owners);
  });
});
