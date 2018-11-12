import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { UnconnectedOfflineBanner } from "components/OfflineBanner";

const Padding = styled.div`
  padding: 2em;
`;

storiesOf("Offline Banner", module)
  .addDecorator(story => <Padding>{story()}</Padding>)
  .addDecorator(withKnobs)
  .add("Primary", () => {
    let isOffline = boolean("offline", false);
    let apiError = boolean("api error", false);
    return (
      <UnconnectedOfflineBanner
        isOffline
        apiError
        hasError={isOffline || apiError}
      />
    );
  });
