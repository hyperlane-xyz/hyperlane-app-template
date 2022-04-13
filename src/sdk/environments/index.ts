import { ChainName } from '@abacus-network/sdk';
import { PingPongContractAddresses } from '../contracts';
import { addresses as test } from './test';

export const addresses: Record<
  string,
  Partial<Record<ChainName, PingPongContractAddresses>>
> = {
  test,
};
