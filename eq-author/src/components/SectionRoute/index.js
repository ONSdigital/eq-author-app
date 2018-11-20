import React from "react";
import { withApollo, Query } from "react-apollo";
import { connect } from "react-redux";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { flowRight, isFunction, isNil } from "lodash";
import fp from "lodash/fp";
import { Titled } from "react-titled";

import SectionEditor from "components/SectionEditor";
import IconButtonDelete from "components/IconButtonDelete";
import { Toolbar, Buttons } from "components/EditorToolbar";
import IconMove from "components/EditorToolbar/icon-move.svg?inline";
import Button from "components/Button";
import IconText from "components/IconText";
import EditorLayout from "components/EditorLayout";
import DuplicateButton from "components/DuplicateButton";
import IntroEditor from "components/IntroEditor";

import withDeleteSection from "containers/enhancers/withDeleteSection";
import withUpdateSection from "containers/enhancers/withUpdateSection";
import withDuplicateSection from "containers/enhancers/withDuplicateSection";
import withCreatePage from "containers/enhancers/withCreatePage";
import withCreateSection from "containers/enhancers/withCreateSection";
import withMoveSection from "containers/enhancers/withMoveSection";

import Loading from "components/Loading";
import Error from "components/Error";

import { raiseToast } from "redux/toast/actions";
export class UnwrappedSectionRoute extends React.Component {
  static propTypes = {
    match: CustomPropTypes.match,
    onUpdateSection: PropTypes.func.isRequired,
    onDeleteSection: PropTypes.func.isRequired,
    onAddPage: PropTypes.func.isRequired,
    onMoveSection: PropTypes.func.isRequired,
    onDuplicateSection: PropTypes.func.isRequired,
    error: PropTypes.object, // eslint-disable-line
    loading: PropTypes.bool.isRequired,
    data: PropTypes.shape({
      section: CustomPropTypes.section
    })
  };

  state = {
    showDeleteConfirmDialog: false,
    showMoveSectionDialog: false
  };

  handleOpenMoveSectionDialog = () => {
    this.setState({ showMoveSectionDialog: true });
  };

  handleCloseMoveSectionDialog = cb => {
    this.setState({ showMoveSectionDialog: false }, isFunction(cb) ? cb : null);
  };

  handleMoveSection = args => {
    this.handleCloseMoveSectionDialog(() => this.props.onMoveSection(args));
  };

  handleOpenDeleteConfirmDialog = () =>
    this.setState({ showDeleteConfirmDialog: true });

  handleCloseDeleteConfirmDialog = cb =>
    this.setState(
      { showDeleteConfirmDialog: false },
      isFunction(cb) ? cb : null
    );

  handleDeleteSectionConfirm = () => {
    const { onDeleteSection, match } = this.props;
    const {
      params: { sectionId }
    } = match;

    this.handleCloseDeleteConfirmDialog(() => onDeleteSection(sectionId));
  };

  handleAddPage = () => {
    const {
      params: { sectionId }
    } = this.props.match;
    this.props.onAddPage(sectionId, 0);
  };

  handleDuplicateSection = () => {
    const {
      onDuplicateSection,
      data: { section }
    } = this.props;
    onDuplicateSection({
      sectionId: section.id,
      position: section.position + 1
    });
  };

  getSectionTitle = section => title => {
    const sectionTitle = section.displayName;
    return `${sectionTitle} - ${title}`;
  };

  isMoveSectionButtonDisabled = fp.flow(
    fp.get("questionnaireInfo.totalSectionCount"),
    fp.isEqual(1)
  );

  renderContent() {
    const { loading, error, data } = this.props;

    if (loading) {
      return <Loading height="24.25rem">Section loading…</Loading>;
    }
    if (error) {
      return <Error>Something went wrong</Error>;
    }
    if (isNil(data.section)) {
      return <Error>Oops! Section could not be found</Error>;
    }

    return (
      <Titled title={this.getSectionTitle(data.section)}>
        <Toolbar>
          <Buttons>
            <Button
              onClick={this.handleOpenMoveSectionDialog}
              data-test="btn-move"
              variant="tertiary"
              small
              disabled={this.isMoveSectionButtonDisabled(
                data.section.questionnaire
              )}
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
          key={data.section.id}
          section={
            data.section // this is needed to reset the state of the RichTextEditors when moving between sections
          }
          onUpdate={this.props.onUpdateSection}
          showDeleteConfirmDialog={this.state.showDeleteConfirmDialog}
          onCloseDeleteConfirmDialog={this.handleCloseDeleteConfirmDialog}
          onDeleteSectionConfirm={this.handleDeleteSectionConfirm}
          showMoveSectionDialog={this.state.showMoveSectionDialog}
          onCloseMoveSectionDialog={this.handleCloseMoveSectionDialog}
          onMoveSectionDialog={this.handleMoveSection}
          {...this.props}
        />
        {data.section && (
          <IntroEditor
            onUpdate={this.props.onUpdateSection}
            section={data.section}
          />
        )}
      </Titled>
    );
  }

  render() {
    const { data = {} } = this.props;
    const section = data.section || {};

    const isPreviewEnabled = Boolean(section.introductionEnabled);

    return (
      <EditorLayout
        section={data.section}
        onUpdate={this.props.onUpdateSection}
        onAddPage={this.handleAddPage}
        data-test="section-route"
        preview={isPreviewEnabled}
      >
        {this.renderContent()}
      </EditorLayout>
    );
  }
}

const withSectionEditing = flowRight(
  connect(
    null,
    { raiseToast }
  ),
  withApollo,
  withCreateSection,
  withDuplicateSection,
  withUpdateSection,
  withDeleteSection,
  withCreatePage,
  withMoveSection
);

export const SECTION_QUERY = gql`
  query SectionQuery($id: ID!) {
    section(id: $id) {
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

export default withSectionEditing(props => (
  <Query query={SECTION_QUERY} variables={{ id: props.match.params.sectionId }}>
    {innerProps => <UnwrappedSectionRoute {...innerProps} {...props} />}
  </Query>
));
