// // metro.config.js
// const { getDefaultConfig } = require("expo/metro-config");

// const config = getDefaultConfig(__dirname);

// config.resolver.assetExts.push("tflite", "txt");

// module.exports = config;

// metro.config.js (project root)
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// ensure tflite files are treated as assets
if (!config.resolver) config.resolver = {};
if (!config.resolver.assetExts) config.resolver.assetExts = [];

if (!config.resolver.assetExts.includes("tflite")) {
  config.resolver.assetExts.push("tflite");
}

module.exports = config;
