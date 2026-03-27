const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.watchFolders = [];
config.resolver.blockList = [
  /backend\/.*/,
];

module.exports = config;