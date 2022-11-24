import React from "react";
import styled from "styled-components";
import { useMutation } from "@apollo/react-hooks";
import CustomPropTypes from "custom-prop-types";

import { Toolbar, ToolbarButtonContainer } from "components/Toolbar";
import IconButtonDelete from "components/buttons/IconButtonDelete";

import DELETE_INTRODUCTION from "graphql/deleteIntroductionPage.graphql";

const IntroductionToolbar = styled(Toolbar)`
  padding: 1.5em 2em 0;
`;

const IntroductionHeader = ({ history }) => {
  const [deleteIntroduction] = useMutation(DELETE_INTRODUCTION);

  const onDeleteIntroduction = () => {
    deleteIntroduction();

    history.goBack();
  };

  return (
    <IntroductionToolbar>
      <ToolbarButtonContainer>
        <IconButtonDelete onClick={onDeleteIntroduction}>
          Delete
        </IconButtonDelete>
      </ToolbarButtonContainer>
    </IntroductionToolbar>
  );
};

IntroductionHeader.propTypes = {
  history: CustomPropTypes.history,
};

export default IntroductionHeader;
