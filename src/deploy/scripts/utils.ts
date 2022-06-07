import {
  AbacusContracts,
  ChainMap,
  ChainName,
  objMap,
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-ethers';
import * as fs from 'fs';
import * as path from 'path';

// TODO move to deployer utils
export function writeContracts(
  chainToContracts: Partial<ChainMap<ChainName, AbacusContracts>>,
  filepath: string,
) {
  const chains = Object.keys(chainToContracts) as ChainName[];
  const addresses = chains.reduce<Partial<ChainMap<ChainName, any>>>(
    (result, chain) => {
      const contracts = chainToContracts[chain];
      if (!contracts) return result;
      const addresses = objMap(contracts, (_, contract) => contract.address);
      result[chain] = addresses;
      return result;
    },
    {},
  );
  const contents = `export const addresses = ${JSON.stringify(
    addresses,
    null,
    2,
  )}`;
  writeToFile(filepath, contents);
}

export function writeToFile(filepath: string, contents: string) {
  const dir = path.dirname(filepath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filepath, contents);
}
