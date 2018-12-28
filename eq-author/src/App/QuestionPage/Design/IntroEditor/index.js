import React from "react";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import styled from "styled-components";
import { flip, partial, flowRight } from "lodash";
import { connect } from "react-redux";

import { raiseToast } from "redux/toast/actions";

import MainCanvas from "App/components/MainCanvas";
import IconButtonDelete from "components/Buttons/IconButtonDelete";
import Button from "components/Buttons/Button";
import IconText from "components/IconText";
import AddPage from "App/QuestionPage/Design/QuestionnaireDesignPage/icon-add-page.svg?inline";
import RichTextEditor from "App/components/RichTextEditor";
import { Buttons } from "App/QuestionPage/Design/EditorToolbar";
import FadeTransition from "components/Transitions/FadeTransition";
import { TransitionGroup } from "react-transition-group";

import { colors, radius } from "constants/theme";

import withDeleteSectionIntro from "App/Section/Design/SectionRoute/withDeleteSectionIntro";

const StyledMainCanvas = styled(MainCanvas)`
  padding: 0 2em 1em;
`;

const AddIntroButton = styled(Button)`
  width: 100%;
  padding: 0.8em 1.8em 0.8em 0.8em;
  border: 1px solid ${colors.bordersLight};
`;

const IntroToolbar = styled.div`
  border: 1px solid ${colors.bordersLight};
  border-bottom: 0;
  border-radius: ${radius} ${radius} 0 0;
  display: flex;
  padding: 1em 1em 0;
`;

export const IntroCanvas = styled.div`
  padding: 0 1em;
  border: 1px solid ${colors.bordersLight};
  border-top: 0;
  background-color: ${colors.white};
  border-radius: 0 0 ${radius} ${radius};
`;

export const ENABLE_INTRO = { name: "introductionEnabled", value: true };

export class UnwrappedIntroEditor extends React.Component {
  handleDeleteSectionIntroduction = () => {
    const { section, onDeleteSectionIntro } = this.props;
    onDeleteSectionIntro(section);
  };

  handleEnableSectionIntroduction = () => {
    const { onUpdate, onChange } = this.props;
    onChange(ENABLE_INTRO, onUpdate);
  };

  hasIntro() {
    return this.props.section.introductionEnabled;
  }

  render() {
    const { section, onUpdate, onChange } = this.props;
    const handleUpdate = partial(flip(onChange), onUpdate);
    return (
      <StyledMainCanvas data-test="section-intro-canvas">
        <TransitionGroup>
          {this.hasIntro() && (
            <FadeTransition exit={false}>
              <div>
                <IntroToolbar>
                  <Buttons>
                    <IconButtonDelete
                      onClick={this.handleDeleteSectionIntroduction}
                      data-test="btn-delete"
                      iconText="Delete Introduction"
                    />
                  </Buttons>
                </IntroToolbar>
                <IntroCanvas>
                  <RichTextEditor
                    id="introduction-title"
                    label="Introduction title"
                    name="introductionTitle"
                    onUpdate={handleUpdate}
                    size="large"
                    testSelector="txt-introduction-title"
                    value={section.introductionTitle}
                    controls={{ piping: true }}
                  />
                  <RichTextEditor
                    id="introduction-content"
                    label="Introduction content"
                    onUpdate={handleUpdate}
                    name="introductionContent"
                    multiline
                    testSelector="txt-introduction-content"
                    value={section.introductionContent}
                    controls={{
                      heading: true,
                      bold: true,
                      list: true,
                      piping: true,
                      emphasis: true
                    }}
                  />
                </IntroCanvas>
              </div>
            </FadeTransition>
          )}
        </TransitionGroup>
        {!this.hasIntro() && (
          <AddIntroButton
            variant="secondary"
            small
            onClick={this.handleEnableSectionIntroduction}
            data-test="btn-add-intro"
          >
            <IconText icon={AddPage}>Add introduction</IconText>
          </AddIntroButton>
        )}
      </StyledMainCanvas>
    );
  }
}

UnwrappedIntroEditor.propTypes = {
  section: CustomPropTypes.section.isRequired,
  onUpdate: PropTypes.func,
  onChange: PropTypes.func,
  onDeleteSectionIntro: PropTypes.func.isRequired
};

const wrappedSectionIntro = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withDeleteSectionIntro
)(UnwrappedIntroEditor);

export default wrappedSectionIntro;
