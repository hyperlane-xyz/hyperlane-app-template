import { RouterConfig } from '@abacus-network/deploy';
import { ChainName } from '@abacus-network/sdk';

export type PingPongConfigAddresses = {

};

export type PingPongConfig<Networks extends ChainName> =
  RouterConfig<Networks>;
