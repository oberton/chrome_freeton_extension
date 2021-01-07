const presets = [
  ["@babel/preset-env", {
    modules: false,
    targets: {
      "chrome": 56
    },
    forceAllTransforms: process.env === "production"
  }]
];

module.exports = {
  presets,
  plugins: ["@babel/plugin-transform-runtime"],
  comments : process.env !== "production"
};

