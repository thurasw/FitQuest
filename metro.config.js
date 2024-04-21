const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const customConfig = {};

const config = mergeConfig(getDefaultConfig(__dirname), customConfig);
module.exports = withNativeWind(config, { input: './index.css' });