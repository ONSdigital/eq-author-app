import React from "react";
import { propType } from "graphql-anywhere";
import PropTypes from "prop-types";
import styled from "styled-components";
import { TransitionGroup } from "react-transition-group";

import AddPage from "App/QuestionnaireDesignPage/icon-add-page.svg?inline";
import MainCanvas from "components/MainCanvas";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import FadeTransition from "components/transitions/FadeTransition";
import { colors, radius } from "constants/theme";

import IntroEditor from "./IntroEditor";
import withCreateSectionIntro from "./withCreateSectionIntro";
import fragment from "./SectionIntroductionFragment.graphql";

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 2em 1em;
`;

export const AddIntroButton = styled(Button)`
  width: 100%;
  padding: 0.8em 1.8em 0.8em 0.8em;
  border: 1px solid ${colors.bordersLight};
`;

export const IntroCanvas = styled.div`
  padding: 0 1em;
  border: 1px solid ${colors.bordersLight};
  border-top: 0;
  background-color: ${colors.white};
  border-radius: 0 0 ${radius} ${radius};
`;

export const UnwrappedSectionIntroduction = props => {
  const { sectionId, sectionIntro, createSectionIntro } = props;
  return (
    <StyledMainCanvas data-test="section-intro-canvas">
      {sectionIntro && (
        <TransitionGroup>
          <FadeTransition exit={false}>
            <IntroEditor {...props} />
          </FadeTransition>{" "}
        </TransitionGroup>
      )}

      {!sectionIntro && (
        <AddIntroButton
          variant="secondary"
          small
          onClick={() => createSectionIntro(sectionId)}
          data-test="btn-add-intro"
        >
          <IconText icon={AddPage}>Add introduction</IconText>
        </AddIntroButton>
      )}
    </StyledMainCanvas>
  );
};

UnwrappedSectionIntroduction.propTypes = {
  sectionId: PropTypes.string.isRequired,
  sectionIntro: propType(fragment),
  createSectionIntro: PropTypes.func.isRequired,
};

export default withCreateSectionIntro(UnwrappedSectionIntroduction);
