module.exports = function (api) {
  api.cache(true);
  const loose = false; // or true, but it must be consistent across these plugins

  return {
    presets: ["babel-preset-expo"],
    "plugins": ["@babel/plugin-transform-runtime","module:react-native-dotenv"]

  };
};
