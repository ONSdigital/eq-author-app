import React from "react";
import styled from "styled-components";

import { Toolbar, ToolbarButtonContainer } from "components/Toolbar";
import IconButtonDelete from "components/buttons/IconButtonDelete";

const IntroductionToolbar = styled(Toolbar)`
  padding: 0;
`;

const IntroductionHeader = () => {
  return (
    <IntroductionToolbar>
      <ToolbarButtonContainer>
        <IconButtonDelete>Delete</IconButtonDelete>
      </ToolbarButtonContainer>
    </IntroductionToolbar>
  );
};

export default IntroductionHeader;
