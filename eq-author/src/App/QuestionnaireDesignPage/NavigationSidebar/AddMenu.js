import React from "react";
import PropTypes from "prop-types";

import styled from "styled-components";
import Button from "components/buttons/Button";
import Popout, { Container, Layer } from "components/Popout";
import IconPlus from "./icon-plus.svg?inline";
import IconSection from "assets/icon-section.svg?inline";
import IconQuestion from "assets/icon-questionpage.svg?inline";
import IconSummary from "assets/icon-summarypage.svg?inline";
import IconConfirmation from "assets/icon-playback.svg?inline";
import IconFolder from "assets/icon-folder.svg?inline";

import IconText from "components/IconText";
import { radius, colors } from "constants/theme";

import PopupTransition from "./PopupTransition";

const AddMenuWindow = styled.div`
  background: white;
  color: black;
  background-color: white;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const AddMenuButton = styled(Button).attrs({
  variant: "add-content-menu",
  medium: true,
})``;

const AddButton = styled(Button).attrs({
  variant: "nav-header",
  medium: true,
})`
  width: 100%;
  padding: 0.7em 2.1em;
  z-index: 15;

  &:focus {
    outline: 3px solid #fdbd56;
    outline-offset: -3px;
  }
`;

const StyledIconText = styled(IconText)`
  justify-content: flex-start;

  svg {
    margin-right: 1em;
    width: 32px;
    height: 32px;

    path {
      fill: ${colors.black};
    }
  }
`;

const StyledIconTextAdd = styled(IconText)`
  justify-content: flex-start;

  svg {
    background-color: ${colors.orange};
    border-radius: ${radius};
    margin-right: 1em;
    flex: inherit;
    width: 22px;
    height: 22px;
    path {
      fill: ${colors.darkGrey};
    }
  }
`;

const PopoutContainer = styled(Container)`
  width: 100%;
`;

const PopoutLayer = styled(Layer)`
  left: auto;
  top: auto;
  width: 100%;
`;

export const AddContent = "Add content";
// TODO not sure if this is the best way to do this
export const isFolderTitle = (title, isInside = true) =>
  `${isInside ? "inside" : "outside"} ${title}`;

const AddBtn = (
  <AddButton data-test="btn-add">
    <StyledIconTextAdd icon={IconPlus}>{AddContent}</StyledIconTextAdd>
  </AddButton>
);

const usePrevious = (props) => {
  const reference = React.useRef();
  React.useEffect(() => {
    reference.current = props;
  });

  return reference.current;
};

// {
// addMenuOpen,
// onAddMenuToggle,
// onAddQuestionPage,
// canAddQuestionPage,
// onAddSection,
// onAddCalculatedSummaryPage,
// canAddCalculatedSummaryPage,
// onAddQuestionConfirmation,
// canAddQuestionConfirmation,
// onAddFolder,
// canAddFolder,
// ...otherProps
// }
const AddMenu = (props) => {
  // Need this to determine if I'm on a folder page
  const { entityType } = useParams();
  const previous = usePrevious(props);
  const {
    addMenuOpen,
    onAddMenuToggle,
    onAddQuestionPage,
    canAddQuestionPage,
    onAddSection,
    onAddCalculatedSummaryPage,
    canAddCalculatedSummaryPage,
    onAddQuestionConfirmation,
    canAddQuestionConfirmation,
    onAddFolder,
    canAddFolder,
    ...otherProps
  } = props;

  // using this to check prop changes
  console.log("before", previous);
  console.log("after", props);
  // testing perf with this
  const onRenderCB = (id, phase, actualDuration, baseDuration) => {
    console.log(id, phase, actualDuration, baseDuration);
  };
  // thinking of pulling all of this out and rendering based off entity type
  // need to check if it's available instantly
  //
  return (
    <React.Profiler id="test" onRender={onRenderCB}>
      <div {...otherProps}>
        <Popout
          open={addMenuOpen}
          trigger={AddBtn}
          onToggleOpen={onAddMenuToggle}
          horizontalAlignment="left"
          verticalAlignment="top"
          transition={PopupTransition}
          container={PopoutContainer}
          layer={PopoutLayer}
        >
          <AddMenuWindow data-test="addmenu-window">
            <AddMenuButton
              primary
              onClick={onAddQuestionPage}
              data-test="btn-add-question-page"
              disabled={!canAddQuestionPage}
            >
              <StyledIconText icon={IconQuestion}>Question</StyledIconText>
            </AddMenuButton>
            <AddMenuButton
              primary
              onClick={onAddSection}
              data-test="btn-add-section"
            >
              <StyledIconText icon={IconSection}>Section</StyledIconText>
            </AddMenuButton>
            <AddMenuButton
              primary
              data-test="btn-add-folder"
              onClick={onAddFolder}
              disabled={!canAddFolder}
            >
              <StyledIconText icon={IconFolder} data-hook="icon-folder">
                Folder
              </StyledIconText>
            </AddMenuButton>
            <AddMenuButton
              primary
              data-test="btn-add-question-confirmation"
              onClick={onAddQuestionConfirmation}
              disabled={!canAddQuestionConfirmation}
            >
              <StyledIconText icon={IconConfirmation}>
                Confirmation question
              </StyledIconText>
            </AddMenuButton>
            <AddMenuButton
              primary
              onClick={onAddCalculatedSummaryPage}
              data-test="btn-add-calculated-summary"
              disabled={!canAddCalculatedSummaryPage}
            >
              <StyledIconText icon={IconSummary}>
                Calculated summary
              </StyledIconText>
            </AddMenuButton>
          </AddMenuWindow>
        </Popout>
      </div>
    </React.Profiler>
  );
};

AddMenu.propTypes = {
  onAddMenuToggle: PropTypes.func.isRequired,
  onAddQuestionPage: PropTypes.func.isRequired,
  canAddQuestionPage: PropTypes.bool.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onAddQuestionConfirmation: PropTypes.func.isRequired,
  canAddQuestionConfirmation: PropTypes.bool.isRequired,
  onAddCalculatedSummaryPage: PropTypes.func.isRequired,
  canAddCalculatedSummaryPage: PropTypes.bool.isRequired,
  addMenuOpen: PropTypes.bool.isRequired,
  onAddFolder: PropTypes.func.isRequired,
  canAddFolder: PropTypes.bool.isRequired,
};

export default AddMenu;
