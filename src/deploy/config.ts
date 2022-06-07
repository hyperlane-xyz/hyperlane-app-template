import { EnvironmentConfig, RouterConfig } from '@abacus-network/deploy';
import { chainConnectionConfigs, ChainName, Chains } from '@abacus-network/sdk';
import { addresses } from '../sdk/environments/test';
// import { testEnvironmentAddresses } from '../sdk/environments/test';

// TODO remove all this boilerplate
export type HelloWorldEnvironmentConfig = EnvironmentConfig<ChainName> & {
  config: RouterConfig;
};

// TODO cut?
// export const environment: HelloWorldEnvironmentConfig = {
//   ...chainConnectionConfigs,
//   config: {
//     abacusConnectionManager:
//       testEnvironmentAddresses.test1.abacusConnectionManager,
//     owner: testEnvironmentAddresses.test1.router,
//   },
// };

export const testNetworks = [Chains.test1, Chains.test2, Chains.test3] as const;
export type TestNetworks = typeof testNetworks[number];
export const testConfigs = {
  test1: chainConnectionConfigs.test1,
  test2: chainConnectionConfigs.test2,
  test3: chainConnectionConfigs.test3,
};

export function getConfigMap(signerAddress: string) {
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
