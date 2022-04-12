import path from 'path';
import yargs from 'yargs';
import { ChainName, MultiProvider } from '@abacus-network/sdk';
import { ALL_ENVIRONMENTS, DeployEnvironment, BridgeConfig } from '../src';

export function getArgs() {
  return yargs(process.argv.slice(2))
    .alias('e', 'env')
    .describe('e', 'deploy environment')
    .choices('e', ALL_ENVIRONMENTS)
    .require('e')
    .help('h')
    .alias('h', 'help');
}

async function importModule(moduleName: string): Promise<any> {
  const importedModule = await import(moduleName);
  return importedModule;
}

function moduleName(environment: DeployEnvironment) {
  return `../config/environments/${environment}`;
}

export async function registerMultiProvider(
  multiProvider: MultiProvider,
  environment: DeployEnvironment,
): Promise<void> {
  return (await importModule(moduleName(environment))).registerMultiProvider(
    multiProvider,
  );
}

export async function getDomainNames(
  environment: DeployEnvironment,
): Promise<ChainName[]> {
  return (await importModule(moduleName(environment))).domains;
}

export async function getBridgeConfig(
  environment: DeployEnvironment,
): Promise<BridgeConfig> {
  return (await importModule(moduleName(environment))).bridge;
}

export async function getEnvironment(): Promise<DeployEnvironment> {
  return (await getArgs().argv).e;
}

function getContractsSdkFilepath(mod: string, environment: DeployEnvironment) {
  return path.join('../sdk/src/', mod, 'environments', `${environment}.ts`);
}

export function getBridgeContractsSdkFilepath(environment: DeployEnvironment) {
  return getContractsSdkFilepath('bridge', environment);
}

export function getEnvironmentDirectory(environment: DeployEnvironment) {
  return path.join('./config/environments/', environment);
}

export function getBridgeDirectory(environment: DeployEnvironment) {
  return path.join(getEnvironmentDirectory(environment), 'bridge');
}

export function getBridgeVerificationDirectory(environment: DeployEnvironment) {
  return path.join(getBridgeDirectory(environment), 'verification');
}
