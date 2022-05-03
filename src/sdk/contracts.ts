import { AbacusContracts, RouterAddresses, routerFactories } from '@abacus-network/sdk';
import { PingPong__factory } from '../types';

export type PingPongAddresses = RouterAddresses

export const pingPongFactories = {
  ...routerFactories,
  router: PingPong__factory.connect,
};

export type PingPongFactories = typeof pingPongFactories;

export class PingPongContracts extends AbacusContracts<
  PingPongAddresses,
  PingPongFactories
> {
  // necessary for factories be defined in the constructor
  factories() {
    return pingPongFactories;
  }
  router = this.contracts.router;
}
