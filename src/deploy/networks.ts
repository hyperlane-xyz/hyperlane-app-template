import { TransactionConfig, utils } from '@abacus-network/deploy';
import { ChainMap } from '@abacus-network/sdk';

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

export const test1: TransactionConfig = {
  confirmations: 1,
  overrides: {},
};

export const test2: TransactionConfig = {
  confirmations: 1,
  overrides: {},
};

export const test3: TransactionConfig = {
  confirmations: 1,
  overrides: {},
};

const _configs = {
  alfajores,
  fuji,
  mumbai,
  kovan,
  test1,
  test2,
  test3
};

export type TemplateNetworks = keyof typeof _configs;

export const configs: ChainMap<keyof typeof _configs, TransactionConfig> =
  _configs;
