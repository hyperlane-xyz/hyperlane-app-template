import { RouterConfig } from '@abacus-network/deploy';
import {
  chainConnectionConfigs,
  ChainMap,
  TestChainNames,
} from '@abacus-network/sdk';
import { addresses } from '../sdk/environments/test';

export type HelloWorldConfig = RouterConfig & {
  owner: string;
};

// TODO reduce this config boilerplate

export const testConfigs = {
  test1: chainConnectionConfigs.test1,
  test2: chainConnectionConfigs.test2,
  test3: chainConnectionConfigs.test3,
};

export function getConfigMap(
  signerAddress: string,
): ChainMap<TestChainNames, RouterConfig> {
  return {
    test1: {
      owner: signerAddress,
      abacusConnectionManager: addresses.test1.abacusConnectionManager,
    },
    test2: {
      owner: signerAddress,
      abacusConnectionManager: addresses.test2.abacusConnectionManager,
    },
    test3: {
      owner: signerAddress,
      abacusConnectionManager: addresses.test3.abacusConnectionManager,
    },
  };
}
