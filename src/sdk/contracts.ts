import { RouterContracts, RouterFactories } from '@abacus-network/sdk';
import { HelloWorld, HelloWorld__factory } from '../types';

export const helloWorldFactories = {
  router: new HelloWorld__factory(),
};

export type HelloWorldFactories = RouterFactories<HelloWorld__factory>;

export type HelloWorldContracts = RouterContracts & {
  router: HelloWorld;
};
