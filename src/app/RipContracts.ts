import { RouterContracts, RouterFactories } from '@abacus-network/sdk';

import { RemoteIdentityProxyRouter, RemoteIdentityProxyRouter__factory } from '../types';

export type RemoteIdentityProxyRouterFactories = RouterFactories<RemoteIdentityProxyRouter>;

export const helloWorldFactories: RemoteIdentityProxyRouterFactories = {
  router: new RemoteIdentityProxyRouter__factory(),
};

export type RemoteIdentityProxyRouterContracts = RouterContracts<RemoteIdentityProxyRouter>;
