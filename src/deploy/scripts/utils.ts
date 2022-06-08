import {
  AbacusContracts,
  ChainMap,
  ChainName,
  objMap,
} from '@abacus-network/sdk';
import '@nomiclabs/hardhat-ethers';

// TODO move to deployer utils
export function extractContractAddresses(
  chainToContracts: Partial<ChainMap<ChainName, AbacusContracts>>,
) {
  const chains = Object.keys(chainToContracts) as ChainName[];
  return chains.reduce<Partial<ChainMap<ChainName, any>>>((result, chain) => {
    const contracts = chainToContracts[chain];
    if (!contracts) return result;
    const addresses = objMap(contracts, (_, contract) => contract.address);
    result[chain] = addresses;
    return result;
  }, {});
}
