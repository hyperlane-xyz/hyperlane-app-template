import { EnvironmentConfig, RouterConfig } from '@abacus-network/deploy';
import { ChainSubsetMap } from '@abacus-network/sdk';
import { TemplateNetworks } from '../../deploy/networks';
import { PingPongContractAddresses } from '../contracts';
import { addresses as test } from './test';

export type PingPongConfig = EnvironmentConfig<TemplateNetworks> & {
  config: RouterConfig<TemplateNetworks>;
};

type Networks = keyof typeof test;

export const addresses: ChainSubsetMap<Networks, PingPongContractAddresses> =
  test;
