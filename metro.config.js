const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [...config.resolver.assetExts, 'wasm'];

config.resolver.sourceExts = [...config.resolver.sourceExts, 'wasm'];

config.watcher.additionalExts = [...(config.watcher.additionalExts || []), 'wasm'];

const projectRoot = __dirname;
const mockSQLitePath = path.resolve(projectRoot, 'src/mocks/expo-sqlite.ts');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web' && moduleName === 'expo-sqlite') {
    return {
      filePath: mockSQLitePath,
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
