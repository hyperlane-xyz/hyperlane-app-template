import { AbacusRouterChecker } from '@abacus-network/deploy';
import { ChainName } from '@abacus-network/sdk';
import { HelloWorldApp } from '../sdk/app';
import { HelloWorldConfig } from '../sdk/config';
import { HelloWorldContracts } from '../sdk/contracts';

export class HelloWorldChecker<
  Chain extends ChainName,
> extends AbacusRouterChecker<
  Chain,
  HelloWorldContracts,
  // @ts-ignore TODO AbacusApp derived classes are not working here
  HelloWorldApp<Chain>,
  HelloWorldConfig
> {}
