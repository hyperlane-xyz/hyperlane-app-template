import { ethers, Wallet } from 'ethers';



import { prodConfigs } from '../deploy/config';
import {  } from "module";
import { RemoteIdentityProxyRouter__factory } from '../types';
import { chainMetadata } from '@abacus-network/sdk';
import { utils } from '@abacus-network/utils';


async function main() {
  console.info('Getting signer');
  const pkey = 'pkey';

  const alfajoresSigner = new Wallet(pkey, prodConfigs.alfajores.provider)
  const fujiSigner = new Wallet(pkey, prodConfigs.fuji.provider)

  const alfajoresRouter = RemoteIdentityProxyRouter__factory.connect("0xBeaacd06137d16D5E8eA15bcF3d10A8eB07767a9", alfajoresSigner)
  const fujiRouter = RemoteIdentityProxyRouter__factory.connect("0x029007368A52f59fb575363A15eE5b34f9bc29a6", fujiSigner)

  // the RIP of the fujiSigner on Alfajores
  const ripAddress = await alfajoresRouter.getRIPAddress(chainMetadata.alfajores.id, utils.addressToBytes32(fujiSigner.address))

  const cUSDAddress = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'

  const erc20Abi = [
    "function balanceOf(address owner) view returns (uint256)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",
  ]
  const cUSD = new ethers.Contract(cUSDAddress, erc20Abi, alfajoresSigner)

  // Transfer cUSD to RIP address
  const transferTx = await cUSD.transfer(ripAddress, 1)
  await transferTx.wait(1)

  console.log('Transfers 1cUSD', transferTx.hash)

  // construct call from the fuji owner for its RIP to burn 1 cUSD
  const burnTxData = (await cUSD.populateTransaction.transfer('0x0000000000000000000000000000000000000001', 1)).data!

 
  const burnTx = await fujiRouter.dispatch(chainMetadata.alfajores.id, [{ to: cUSDAddress, data: burnTxData }])
  await burnTx.wait(1)
  console.log('Burn TX', burnTx.hash)
}

main()
  .then(() => console.info('Test complete'))
  .catch(console.error);
