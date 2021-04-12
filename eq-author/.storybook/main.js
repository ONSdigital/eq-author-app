const Path = require("path");

const AppSourceDir = Path.join(__dirname, "..", "src");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-controls",
    "@storybook/addon-a11y",
  ],
  webpackFinal: (config) => {
    // Disable the Storybook internal-`.svg`-rule for components loaded from our app.
    const svgRule = config.module.rules.find((rule) =>
      "test.svg".match(rule.test)
    );
    svgRule.exclude = [AppSourceDir];

    // Use svgr / url-loader to load SVG files
    config.module.rules.push({
      test: /\.svg$/i,
      include: [AppSourceDir],
      use: ["@svgr/webpack", "url-loader"],
    });

    return config;
  },
};
