import { ChainName } from '@abacus-network/sdk';
import { TransactionConfig, utils } from '@abacus-network/deploy';

const signer = utils.getHardhatSigner();

export const alfajores: TransactionConfig = {
  confirmations: 1,
  overrides: {},
  signer,
};

export const fuji: TransactionConfig = {
  confirmations: 1,
  overrides: {},
  signer,
};

export const mumbai: TransactionConfig = {
  confirmations: 3,
  overrides: {},
  signer,
};

export const kovan: TransactionConfig = {
  confirmations: 3,
  overrides: {},
  signer,
};

export const configs: Partial<Record<ChainName, TransactionConfig>> = {
  alfajores,
  fuji,
  mumbai,
  kovan,
};
