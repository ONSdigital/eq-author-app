import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { get, flip, partial } from "lodash";

import RichTextEditor from "components/RichTextEditor";
import DescribedText from "components/DescribedText";

import Modal from "components-themed/Modal";
import HubSettings from "./HubSettings";
import SectionSummary from "./SectionSummary";
import RepeatingSection from "./RepeatingSection";

import { colors } from "constants/theme";

import withValidationError from "enhancers/withValidationError";

import sectionFragment from "graphql/fragments/section.graphql";

import getIdForObject from "utils/getIdForObject";

import MoveSectionModal from "./MoveSectionModal";
import MoveSectionQuery from "./MoveSectionModal/MoveSectionQuery";
import SectionIntroduction from "./SectionIntroduction";
import {
  sectionErrors,
  richTextEditorErrors,
} from "constants/validationMessages";
import {
  DELETE_SECTION_TITLE,
  DELETE_PAGE_WARNING,
  DELETE_BUTTON_TEXT,
} from "constants/modal-content";

const titleControls = {
  emphasis: true,
  piping: true,
};

const Padding = styled.div`
  padding: 0 2em 2em;
`;

const HorizontalRule = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.2em 0;
`;

const SectionCanvas = styled.div`
  padding: 0;
`;

const hasNavigation = (section) =>
  get(section, ["questionnaire", "navigation"]);

export class SectionEditor extends React.Component {
  static propTypes = {
    section: propType(sectionFragment),
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDeleteSectionConfirm: PropTypes.func.isRequired,
    onCloseDeleteConfirmModal: PropTypes.func.isRequired,
    showDeleteConfirmModal: PropTypes.bool.isRequired,
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
      showDeleteConfirmModal,
      onCloseDeleteConfirmModal,
      onDeleteSectionConfirm,
      match,
    } = this.props;

    const handleUpdate = partial(flip(onChange), onUpdate);

    const navHasChanged =
      this.previousNav !== hasNavigation(this.props.section);
    const hasTitle = this.props.section?.title;

    const autoFocusTitle = !navHasChanged && !hasTitle;

    const hasHub = section?.questionnaire?.hub;

    return (
      <SectionCanvas data-test="section-editor" id={getIdForObject(section)}>
        <Modal
          title={DELETE_SECTION_TITLE}
          warningMessage={DELETE_PAGE_WARNING}
          positiveButtonText={DELETE_BUTTON_TEXT}
          isOpen={showDeleteConfirmModal}
          onConfirm={onDeleteSectionConfirm}
          onClose={onCloseDeleteConfirmModal}
        />
        <MoveSectionQuery questionnaireId={match.params.questionnaireId}>
          {this.renderMoveSectionModal}
        </MoveSectionQuery>

        {hasHub && (
          <HubSettings
            id={section?.id}
            requiredCompleted={section?.requiredCompleted}
            showOnHub={section?.showOnHub}
          />
        )}

        <Padding>
          <RichTextEditor
            id="section-title"
            name="title"
            label={
              <DescribedText description="This will be shown on the hub.">
                Section title
              </DescribedText>
            }
            value={section?.title}
            onUpdate={handleUpdate}
            controls={titleControls}
            size="large"
            testSelector="txt-section-title"
            autoFocus={autoFocusTitle}
            listId={section.repeatingSectionListId}
            errorValidationMsg={
              section &&
              this.props.getValidationError({
                field: "title",
                message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
              })
            }
          />
          <HorizontalRule />
          <SectionIntroduction
            section={section}
            handleUpdate={handleUpdate}
            introductionTitleErrorMessage={
              section &&
              this.props.getValidationError({
                field: "introductionTitle",
                label: "Introduction Title",
                requiredMsg: sectionErrors.SECTION_INTRO_TITLE_NOT_ENTERED,
                message: richTextEditorErrors.PIPING_TITLE_DELETED.message,
              })
            }
            introductionContentErrorMessage={
              section &&
              this.props.getValidationError({
                field: "introductionContent",
                label: "Introduction Content",
                requiredMsg: sectionErrors.SECTION_INTRO_CONTENT_NOT_ENTERED,
                message: richTextEditorErrors.PIPING_TITLE_DELETED.message,
              })
            }
          />
          <HorizontalRule />
          <SectionSummary
            id={section.id}
            sectionSummary={section.sectionSummary}
            sectionSummaryPageDescription={
              section.sectionSummaryPageDescription
            }
            errors={section.validationErrorInfo.errors}
          />
          <HorizontalRule />
          <RepeatingSection section={section} handleUpdate={handleUpdate} />
        </Padding>
      </SectionCanvas>
    );
  }
}

SectionEditor.fragments = {
  Section: sectionFragment,
};

export default withValidationError("section")(SectionEditor);
