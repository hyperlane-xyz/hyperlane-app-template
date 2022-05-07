import { utils } from '@abacus-network/deploy';
import { ethers } from 'hardhat';
import { YoApp } from '../../sdk';
import { environments } from '../../sdk/environments';
import { YoChecker } from '../check';
import { testConfigs } from '../networks';

async function check() {
  const [signer] = await ethers.getSigners();
  const multiProvider = utils.getMultiProviderFromConfigAndSigner(testConfigs, signer);


  const app = new YoApp(environments.test, multiProvider)
  const pingPongChecker = new YoChecker(
    multiProvider,
    app,
    { test1: { owner: signer.address }, test2: { owner: signer.address }, test3: { owner: signer.address }}
  );
  await pingPongChecker.check();
  pingPongChecker.expectEmpty();
}

check().then(console.log).catch(console.error);
