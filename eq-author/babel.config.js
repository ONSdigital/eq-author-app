module.exports = {
  presets: [["@babel/preset-env", { modules: false }], "@babel/preset-react"],
  plugins: [
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
    [
      "babel-plugin-styled-components",
      {
        ssr: true,
      },
    ],
    "babel-plugin-add-react-displayname",
    "react-hot-loader/babel",
  ],
  env: {
    test: {
      presets: [["@babel/preset-env", { targets: { node: "current" } }]],
    },
  },
};
