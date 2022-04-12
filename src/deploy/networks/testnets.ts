import { ChainName } from '@abacus-network/sdk';
import { TransactionConfig } from '@abacus-network/deploy';

export const alfajores: TransactionConfig = {
  confirmations: 1,
  overrides: {},
};

export const fuji: TransactionConfig = {
  confirmations: 1,
  overrides: {},
};

export const mumbai: TransactionConfig = {
  confirmations: 3,
  overrides: {},
};

export const kovan: TransactionConfig = {
  confirmations: 3,
  overrides: {},
};

export const configs: Partial<Record<ChainName, TransactionConfig>> = {
  alfajores,
  fuji,
  mumbai,
  kovan,
};
