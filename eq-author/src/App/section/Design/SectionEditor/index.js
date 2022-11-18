import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { get, flip, partial } from "lodash";

import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import RichTextEditor from "components/RichTextEditor";
import DescribedText from "components/DescribedText";
// import { Label } from "components/Forms";
import HubSettings from "./HubSettings";
import SectionSummary from "./SectionSummary";
// import PageTitleInput from "components/PageTitle";
// import PageTitleInput from "components/PageTitle/PageTitleInput"
import { Field, Input, Label } from "components/Forms";

import Collapsible from "components/Collapsible";

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

const HorizontalRule = styled.hr`
  border: 0;
  border-top: 0.0625em solid ${colors.lightMediumGrey};
  margin: 1.2em 0;
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

const PageTitleContent = styled.div`
  color: ${colors.black};
`;

const Heading = styled.h2`
  font-size: 1em;
  font-weight: bold;
  line-height: 1.3em;
  margin-bottom: 0.4em;
`;

const StyledInput = styled(Input)`
  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.errorPrimary};
    &:focus,
    &:focus-within {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
      box-shadow: 0 0 0 2px ${colors.errorPrimary};
    }
    &:hover {
      border-color: ${colors.errorPrimary};
      outline-color: ${colors.errorPrimary};
    }
  `}
`;

const Justification = styled(Collapsible)`
  margin-bottom: 1em;
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
    const hasTitle = this.props.section?.title;

    const autoFocusTitle = !navHasChanged && !hasTitle;

    const hasHub = section?.questionnaire?.hub;

    return (
      <SectionCanvas data-test="section-editor" id={getIdForObject(section)}>
        <DeleteConfirmDialog
          isOpen={showDeleteConfirmDialog}
          onClose={onCloseDeleteConfirmDialog}
          onDelete={onDeleteSectionConfirm}
          title={section?.displayName}
          alertText="All questions in this section will also be removed. This may affect piping and routing rules elsewhere."
          icon={iconSection}
          data-test="dialog-delete-confirm"
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
              <DescribedText description="This will be shown on the hub. You can enable or disable it in 'settings'.">
                Section title
              </DescribedText>
            }
            value={section?.title}
            onUpdate={handleUpdate}
            controls={titleControls}
            size="large"
            testSelector="txt-section-title"
            autoFocus={autoFocusTitle}
            errorValidationMsg={
              section &&
              this.props.getValidationError({
                field: "title",
                message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
              })
            }
          />
          <HorizontalRule />
          <SectionSummary
            id={section.id}
            sectionSummary={section.sectionSummary}
          />
          <HorizontalRule />
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
              value={section?.introductionTitle}
              controls={{ piping: true }}
              errorValidationMsg={
                section &&
                this.props.getValidationError({
                  field: "introductionTitle",
                  label: "Introduction Title",
                  requiredMsg: sectionErrors.SECTION_INTRO_TITLE_NOT_ENTERED,
                })
              }
            />
            <RichTextEditor
              id="introduction-content"
              label="Introduction content"
              multiline
              onUpdate={handleUpdate}
              name="introductionContent"
              testSelector="txt-introduction-content"
              value={section?.introductionContent}
              controls={{
                heading: true,
                bold: true,
                list: true,
                piping: true,
                emphasis: true,
                link: true,
              }}
              errorValidationMsg={
                section &&
                this.props.getValidationError({
                  field: "introductionContent",
                  label: "Introduction Content",
                  requiredMsg: sectionErrors.SECTION_INTRO_CONTENT_NOT_ENTERED,
                })
              }
            />
          </IntroCanvas>
          <HorizontalRule />
          {/* <PageTitleInput 
            pageDescription={section?.pageDescription}
            onUpdate={handleUpdate}
            onChange={onChange}
          /> */}
          <PageTitleContent>
            <Heading>Descriptions and definitions</Heading>
            <p>
              The page description is the first part of the page title. Page
              titles follow the structure: ‘page description – questionnaire
              title’.
            </p>
            <p>
              For help writing a page description, see our{" "}
              <a
                href="https://ons-design-system.netlify.app/guidance/page-titles-and-urls/#page-titles"
                target="_blank"
                rel="noopener noreferrer"
              >
                design system guidance on page titles
              </a>
              .
            </p>
            <Justification
              title="Why do I need a page description?"
              key={`justification-pagetitle`}
            >
              <p>
                The page title is the first thing read out to those using a
                screen reader and helps users identify the purpose of the page.
                You can see page titles in the tab at the top of your browser.
              </p>
            </Justification>
            <Field>
              <RichTextEditor
                id="page-description"
                label="Page description"
                multiline
                onUpdate={handleUpdate}
                name="pageDescription"
                testSelector="txt-page-description"
                value={section?.pageDescription}
                controls={{
                  heading: true,
                  bold: true,
                  list: true,
                  piping: true,
                  emphasis: true,
                  link: true,
                }}
                errorValidationMsg={
                  section &&
                  this.props.getValidationError({
                    field: "pageDescription",
                    label: "Page description",
                    requiredMsg:
                      sectionErrors.SECTION_INTRO_CONTENT_NOT_ENTERED,
                  })
                }
              />
              {/* <Label htmlFor="pageDescription">Page description</Label>
                <StyledInput
                  id="page-description"
                  type="text"
                  data-test="txt-page-description"
                  autoComplete="off"
                  name="pageDescription"
                  placeholder=""
                  onUpdate={handleUpdate}
                  value={section?.pageDescription}
                  errorValidationMsg={
                    section &&
                    this.props.getValidationError({
                      field: "pageDescription",
                      message: sectionErrors.SECTION_TITLE_NOT_ENTERED,
                    })
                  }
                /> */}
            </Field>
          </PageTitleContent>
        </Padding>
      </SectionCanvas>
    );
  }
}

SectionEditor.fragments = {
  Section: sectionFragment,
};

export default withValidationError("section")(SectionEditor);
