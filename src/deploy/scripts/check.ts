import { utils } from '@abacus-network/deploy';
import { ethers } from 'hardhat';
import { PingPongApp } from '../../sdk';
import { environments } from '../../sdk/environments';
import { PingPongChecker } from '../check';
import { configs } from '../networks';

async function check() {
  const transactionConfigs = {
    alfajores: configs.alfajores,
    kovan: configs.kovan,
  };
  const [signer] = await ethers.getSigners();
  const multiProvider = utils.initHardhatMultiProvider({ transactionConfigs }, signer);

  const app = new PingPongApp(environments.test, multiProvider)
  const pingPongChecker = new PingPongChecker(
    multiProvider,
    app,
    {}
  );
  await pingPongChecker.check('0x0');
  pingPongChecker.expectEmpty();
}

check().then(console.log).catch(console.error);
