import { TransactionConfig, utils } from '@abacus-network/deploy';
import { ChainSubsetMap } from '@abacus-network/sdk';

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

const _configs = {
  alfajores,
  fuji,
  mumbai,
  kovan,
};

export type TemplateNetworks = keyof typeof _configs;

export const configs: ChainSubsetMap<TemplateNetworks, TransactionConfig> = {
  alfajores,
  fuji,
  mumbai,
  kovan,
};
