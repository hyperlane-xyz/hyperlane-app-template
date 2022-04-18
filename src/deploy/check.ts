import { AbacusRouterChecker, RouterConfig } from '@abacus-network/deploy';
import { types } from '@abacus-network/utils';
import { PingPongApp } from '../sdk';
import { PingPong } from '../types';
import { TemplateNetworks } from './networks';

export class PingPongChecker extends AbacusRouterChecker<
  TemplateNetworks,
  PingPongApp,
  RouterConfig<TemplateNetworks>
> {
  mustGetRouter(domain: types.Domain): PingPong {
    return this.app.mustGetContracts(domain).router;
  }
}
