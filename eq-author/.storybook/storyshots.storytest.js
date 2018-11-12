import initStoryshots from "@storybook/addon-storyshots";
import { mount } from "enzyme";

import registerRequireContextHook from "babel-plugin-require-context-hook/register";
// Needed as storyshots runs outside of webpack https://github.com/storybooks/storybook/issues/2894
registerRequireContextHook();

function renderOnly({ story, context }) {
  var storyElement = story.render(context);
  mount(storyElement);
}

initStoryshots({
  framework: "react",
  test: renderOnly
});
