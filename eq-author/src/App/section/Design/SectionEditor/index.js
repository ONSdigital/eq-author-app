import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { get, flip, partial } from "lodash";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import RichTextEditor from "components/RichTextEditor";
import DescribedText from "components/DescribedText";
import { Label } from "components/Forms";

import { colors, radius } from "constants/theme";

import withValidationError from "enhancers/withValidationError";

import sectionFragment from "graphql/fragments/section.graphql";

import getIdForObject from "utils/getIdForObject";

import MoveSectionModal from "./MoveSectionModal";
import MoveSectionQuery from "./MoveSectionModal/MoveSectionQuery";
import iconSection from "./icon-dialog-section.svg";
import { sectionErrors } from "constants/validationMessages";

const titleControls = {
  emphasis: true,
};

const Padding = styled.div`
  padding: 0 2em 2em;
`;

const SectionCanvas = styled.div`
  padding: 0;
`;

const IntroCanvas = styled.div`
  padding: 1.5em 1.5em 0;
  border: 1px solid ${colors.bordersLight};
  background-color: ${colors.white};
  border-radius: ${radius} ${radius};
`;

const hasNavigation = (section) =>
  get(section, ["questionnaire", "navigation"]);

export class SectionEditor extends React.Component {
  static propTypes = {
    section: propType(sectionFragment),
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDeleteSectionConfirm: PropTypes.func.isRequired,
    onCloseDeleteConfirmDialog: PropTypes.func.isRequired,
    showDeleteConfirmDialog: PropTypes.bool.isRequired,
    onMoveSectionDialog: PropTypes.func.isRequired,
    showMoveSectionDialog: PropTypes.bool.isRequired,
    onCloseMoveSectionDialog: PropTypes.func.isRequired,
    match: CustomPropTypes.match.isRequired,
    getValidationError: PropTypes.func.isRequired,
  };

  state = {
    autoFocusTitle: false,
  };

  previousNav = hasNavigation(this.props.section);

  componentDidUpdate(prevProps) {
    if (
      hasNavigation(prevProps.section) !== hasNavigation(this.props.section)
    ) {
      this.previousNav = hasNavigation(this.props.section);
    }
  }

  renderMoveSectionModal = ({ loading, error, data }) => {
    const {
      onMoveSectionDialog,
      showMoveSectionDialog,
      onCloseMoveSectionDialog,
      section,
    } = this.props;

    if (loading || error || !data) {
      return null;
    }
    return (
      <MoveSectionModal
        questionnaire={data.questionnaire}
        isOpen={showMoveSectionDialog}
        onClose={onCloseMoveSectionDialog}
        onMoveSection={onMoveSectionDialog}
        section={section}
      />
    );
  };

  render() {
    const {
      section,
      onUpdate,
      onChange,
      showDeleteConfirmDialog,
      onCloseDeleteConfirmDialog,
      onDeleteSectionConfirm,
      match,
    } = this.props;
    const handleUpdate = partial(flip(onChange), onUpdate);

    const navHasChanged =
      this.previousNav !== hasNavigation(this.props.section);
    const hasTitle = this.props.section.title;

    const autoFocusTitle = !navHasChanged && !hasTitle;

    const hasNav = section.questionnaire.navigation;
    return (
      <SectionCanvas data-test="section-editor" id={getIdForObject(section)}>
        <DeleteConfirmDialog
          isOpen={showDeleteConfirmDialog}
          onClose={onCloseDeleteConfirmDialog}
          onDelete={onDeleteSectionConfirm}
          title={section.displayName}
          alertText="All questions in this section will also be removed. This may affect piping and routing rules elsewhere."
          icon={iconSection}
          data-test="dialog-delete-confirm"
        />
        <MoveSectionQuery questionnaireId={match.params.questionnaireId}>
          {this.renderMoveSectionModal}
        </MoveSectionQuery>
        <Padding>
          <RichTextEditor
            id="section-title"
            name="title"
            label={
              <DescribedText description="This is displayed in the section navigation. You can enable or disable it in 'settings'">
                Section title
              </DescribedText>
            }
            value={section.title}
            disabled={!hasNav}
            onUpdate={handleUpdate}
            controls={titleControls}
            size="large"
            testSelector="txt-section-title"
            autoFocus={autoFocusTitle}
            errorValidationMsg={this.props.getValidationError({
              field: "title",
              message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
            })}
          />
          <Label>
            <DescribedText description="If you do not want an introduction page, leave these blank">
              Section introduction page
            </DescribedText>
          </Label>
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
              errorValidationMsg={this.props.getValidationError({
                field: "introductionTitle",
                label: "Introduction Title",
                requiredMsg: sectionErrors.SECTION_INTRO_TITLE_NOT_ENTERED,
              })}
            />
            <RichTextEditor
              id="introduction-content"
              label="Introduction content"
              multiline
              onUpdate={handleUpdate}
              name="introductionContent"
              testSelector="txt-introduction-content"
              value={section.introductionContent}
              controls={{
                heading: true,
                bold: true,
                list: true,
                piping: true,
                emphasis: true,
                link: true,
              }}
              errorValidationMsg={this.props.getValidationError({
                field: "introductionContent",
                label: "Introduction Content",
                requiredMsg: sectionErrors.SECTION_INTRO_CONTENT_NOT_ENTERED,
              })}
            />
          </IntroCanvas>
        </Padding>
      </SectionCanvas>
    );
  }
}

SectionEditor.fragments = {
  Section: sectionFragment,
};

export default withValidationError("section")(SectionEditor);
