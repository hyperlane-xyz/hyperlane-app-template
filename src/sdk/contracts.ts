import {
  XAppConnectionManager,
  XAppConnectionManager__factory,
} from '@abacus-network/core';
import { types } from '@abacus-network/utils';
import { AbacusAppContracts } from '@abacus-network/sdk';

import { PingPong, PingPong__factory } from '../types';

export type PingPongContractAddresses = {
  router: types.Address;
  xAppConnectionManager: types.Address;
};

export class PingPongContracts extends AbacusAppContracts<PingPongContractAddresses> {
  get router(): PingPong {
    return PingPong__factory.connect(this.addresses.router, this.connection);
  }

  get xAppConnectionManager(): XAppConnectionManager {
    return XAppConnectionManager__factory.connect(
      this.addresses.xAppConnectionManager,
      this.connection,
    );
  }
}
