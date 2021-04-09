import React from "react";

import {
  Title,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from "@storybook/addon-docs/blocks";

import ToggledCollapsible from "components/CollapsibleToggled";

export default {
  title: "Components/Collapsible Toggled",
  component: ToggledCollapsible,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Description>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet velit non ligula vulputate efficitur non sit amet ex. Aenean
            iaculis odio a lobortis tristique. Suspendisse est ipsum, finibus et
            bibendum a, hendrerit et neque. Aliquam varius porta eros, in
            suscipit libero tempor eget. Aenean eget lectus posuere, ullamcorper
            ex sed, scelerisque lacus.
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

const ToggledCollapsibleTemplate = (args) => (
  <ToggledCollapsible {...args}>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent ut eros
      a turpis tincidunt consectetur sit amet quis enim. Vivamus scelerisque
      finibus erat id mattis. In leo dolor, faucibus non volutpat vel,
      pellentesque et nibh. Pellentesque habitant morbi tristique senectus et
      netus et malesuada fames ac turpis egestas. Aliquam iaculis augue vel
      tortor tempus cursus. Donec pharetra ac ligula vel suscipit. Nunc tempor,
      neque eu suscipit auctor, lacus massa dictum nisl, in fringilla augue
      magna sit amet sem. Mauris at molestie tellus, eget porta enim.
      Pellentesque quis malesuada libero. Proin in odio egestas, pulvinar ligula
      non, ultricies nisl. Sed cursus felis tristique, ultrices justo at,
      ullamcorper risus.
    </p>
    <p>
      Phasellus viverra malesuada tincidunt. Fusce vulputate odio mauris, eu
      finibus nisl luctus quis. Sed dignissim dapibus sapien, at sollicitudin
      neque auctor non. Interdum et malesuada fames ac ante ipsum primis in
      faucibus. Aenean viverra tortor interdum ex malesuada, ac elementum ligula
      auctor. Sed lacus orci, cursus sed volutpat ac, porta id mauris.
      Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
      cubilia curae; Cras mattis id lorem sed egestas. Cras mollis erat quis
      mollis tempus. Donec auctor dictum nibh at commodo. Proin ac varius neque.
      Integer tristique tellus quis purus convallis lacinia. Duis sit amet eros
      scelerisque, aliquam justo in, consequat risus.
    </p>
  </ToggledCollapsible>
);

export const Default = ToggledCollapsibleTemplate.bind({});
Default.args = {
  title: "GB theme",
};
