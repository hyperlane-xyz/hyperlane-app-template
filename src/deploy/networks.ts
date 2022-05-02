import { TransactionConfig, utils } from '@abacus-network/deploy';
import { inferChainSubsetMap } from '@abacus-network/sdk';

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

export const configs = inferChainSubsetMap({
  alfajores,
  fuji,
  mumbai,
  kovan,
});
