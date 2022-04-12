import { types } from '@abacus-network/utils';
import { AbacusRouterChecker, RouterConfig } from '@abacus-network/deploy';
import { PingPongApp } from '../sdk';
import { PingPong } from '../types';

export class PingPongChecker extends AbacusRouterChecker<
  PingPongApp,
  RouterConfig
> {
  mustGetRouter(domain: types.Domain): PingPong {
    return this.app.mustGetContracts(domain).router;
  }
}
