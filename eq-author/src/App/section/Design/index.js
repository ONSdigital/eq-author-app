import React from "react";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { get, flowRight, isFunction, isEmpty } from "lodash";
import fp from "lodash/fp";

import SectionEditor from "App/section/Design/SectionEditor";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";
import IconMove from "assets/icon-move.svg?inline";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import EditorLayout from "components/EditorLayout";
import DuplicateButton from "components/buttons/DuplicateButton";

import withCreateQuestionPage from "enhancers/withCreateQuestionPage";
import withCreateSection from "enhancers/withCreateSection";

import withDeleteSection from "./withDeleteSection";
import withUpdateSection from "./withUpdateSection";
import withDuplicateSection from "./withDuplicateSection";
import withMoveSection from "./withMoveSection";

import { Label } from "components/Forms";

import Loading from "components/Loading";
import Error from "components/Error";

import withEntityEditor from "components/withEntityEditor";
import withPropRenamed from "enhancers/withPropRenamed";
import sectionFragment from "graphql/fragments/section.graphql";

import AliasEditor from "components/AliasEditor";
import Panel from "components/Panel";

export class UnwrappedSectionRoute extends React.Component {
  static propTypes = {
    match: CustomPropTypes.match.isRequired,
    onUpdateSection: PropTypes.func.isRequired,
    onDeleteSection: PropTypes.func.isRequired,
    onAddQuestionPage: PropTypes.func.isRequired,
    onMoveSection: PropTypes.func.isRequired,
    onDuplicateSection: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    error: PropTypes.object, // eslint-disable-line
    loading: PropTypes.bool.isRequired,
    section: CustomPropTypes.section,
  };

  state = {
    showDeleteConfirmDialog: false,
    showMoveSectionDialog: false,
  };

  handleOpenMoveSectionDialog = () => {
    this.setState({ showMoveSectionDialog: true });
  };

  handleCloseMoveSectionDialog = (cb) => {
    this.setState({ showMoveSectionDialog: false }, isFunction(cb) ? cb : null);
  };

  handleMoveSection = (args) => {
    this.handleCloseMoveSectionDialog(() => this.props.onMoveSection(args));
  };

  handleOpenDeleteConfirmDialog = () =>
    this.setState({ showDeleteConfirmDialog: true });

  handleCloseDeleteConfirmDialog = (cb) =>
    this.setState(
      { showDeleteConfirmDialog: false },
      isFunction(cb) ? cb : null
    );

  handleDeleteSectionConfirm = () => {
    const { onDeleteSection, match } = this.props;
    const {
      params: { sectionId },
    } = match;
    console.log("onDeleteSection", onDeleteSection);

    this.handleCloseDeleteConfirmDialog(() => onDeleteSection(sectionId));
  };

  handleAddPage = () => {
    const {
      params: { sectionId },
    } = this.props.match;
    this.props.onAddQuestionPage(sectionId, 0);
  };

  handleDuplicateSection = () => {
    const { onDuplicateSection, section } = this.props;
    onDuplicateSection({
      sectionId: section.id,
      position: section.position + 1,
    });
  };

  getSectionTitle = (section) => (title) => {
    const sectionTitle = section.displayName;
    return `${sectionTitle} - ${title}`;
  };

  isMoveSectionButtonDisabled = fp.flow(
    fp.get("questionnaireInfo.totalSectionCount"),
    fp.isEqual(1)
  );

  renderContent() {
    const { loading, error, section, onUpdate, onChange } = this.props;
    if (loading) {
      return <Loading height="24.25rem">Section loading…</Loading>;
    }
    if (error) {
      return <Error>Something went wrong</Error>;
    }
    if (isEmpty(section)) {
      return <Error>Oops! Section could not be found</Error>;
    }

    return (
      <>
        <Toolbar>
          <div>
            <Label htmlFor="alias">Short code</Label>
            <AliasEditor
              alias={section.alias}
              onUpdate={onUpdate}
              onChange={onChange}
            />
          </div>
          <Buttons>
            <Button
              onClick={this.handleOpenMoveSectionDialog}
              data-test="btn-move"
              variant="tertiary"
              small
              disabled={this.isMoveSectionButtonDisabled(section.questionnaire)}
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton
              onClick={this.handleDuplicateSection}
              data-test="btn-duplicate-section"
            >
              Duplicate
            </DuplicateButton>
            <IconButtonDelete
              onClick={this.handleOpenDeleteConfirmDialog}
              data-test="btn-delete"
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <SectionEditor
          key={section.id}
          onUpdate={this.props.onUpdateSection}
          showDeleteConfirmDialog={this.state.showDeleteConfirmDialog}
          onCloseDeleteConfirmDialog={this.handleCloseDeleteConfirmDialog}
          onDeleteSectionConfirm={this.handleDeleteSectionConfirm}
          showMoveSectionDialog={this.state.showMoveSectionDialog}
          onCloseMoveSectionDialog={this.handleCloseMoveSectionDialog}
          onMoveSectionDialog={this.handleMoveSection}
          {...this.props}
          section={section}
        />
      </>
    );
  }

  render() {
    const { section = {} } = this.props;
    const hasIntroductionContent = Boolean(
      section.introductionTitle || section.introductionContent
    );

    return (
      <EditorLayout
        onAddQuestionPage={this.handleAddPage}
        data-test="section-route"
        preview={hasIntroductionContent}
        title={section.displayName || ""}
        validationErrorInfo={section.validationErrorInfo}
      >
        <Panel>{this.renderContent()}</Panel>
      </EditorLayout>
    );
  }
}

const withSectionEditing = flowRight(
  withApollo,
  withCreateSection,
  withDuplicateSection,
  withUpdateSection,
  withDeleteSection,
  withCreateQuestionPage,
  withMoveSection,
  withPropRenamed("onUpdateSection", "onUpdate"),
  withEntityEditor("section", sectionFragment)
);

const WrappedSectionRoute = withSectionEditing(UnwrappedSectionRoute);

export const SECTION_QUERY = gql`
  query SectionQuery($input: QueryInput!) {
    section(input: $input) {
      ...Section
      displayName
      position
      questionnaire {
        id
        questionnaireInfo {
          totalSectionCount
        }
      }
    }
  }

  ${SectionEditor.fragments.Section}
`;

const SectionRoute = (props) => (
  <Query
    query={SECTION_QUERY}
    variables={{
      input: {
        questionnaireId: props.match.params.questionnaireId,
        sectionId: props.match.params.sectionId,
      },
    }}
  >
    {(innerProps) => (
      <WrappedSectionRoute
        section={get(innerProps, "data.section", {})}
        {...innerProps}
        {...props}
      />
    )}
  </Query>
);

SectionRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      questionnaireId: PropTypes.string.isRequired,
      sectionId: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default SectionRoute;
