import { HelloWorld, HelloWorld__factory } from '../types';

export type HelloWorldFactories = {
  router: HelloWorld__factory;
};

export const helloWorldFactories: HelloWorldFactories = {
  router: new HelloWorld__factory(),
};

export type HelloWorldContracts = {
  router: HelloWorld;
};
