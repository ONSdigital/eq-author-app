import React, { useState } from "react";
import { useSetNavigationCallbacks } from "components/NavigationCallbacks";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";
import { get, flowRight, isEmpty } from "lodash";

import {
  useCreatePageWithFolder,
  useCreateFolder,
} from "hooks/useCreateFolder";

import SectionEditor from "App/section/Design/SectionEditor";
import IconButtonDelete from "components/buttons/IconButtonDelete";
import { Toolbar, Buttons } from "App/page/Design/EditorToolbar";
import IconMove from "assets/icon-move.svg?inline";
import Button from "components/buttons/Button";
import IconText from "components/IconText";
import EditorLayout from "components/EditorLayout";
import DuplicateButton from "components/buttons/DuplicateButton";

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
import { enableOn } from "utils/featureFlags";
import AliasEditor from "components/AliasEditor";
import Panel from "components/Panel";

const propTypes = {
  match: CustomPropTypes.match.isRequired,
  onUpdateSection: PropTypes.func.isRequired,
  onDeleteSection: PropTypes.func.isRequired,
  onMoveSection: PropTypes.func.isRequired,
  onDuplicateSection: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  error: PropTypes.object, // eslint-disable-line
  loading: PropTypes.bool.isRequired,
  section: CustomPropTypes.section,
};
export const UnwrappedSectionRoute = (props) => {
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [showMoveSectionDialog, setMoveSectionDialog] = useState(false);
  const addFolderWithPage = useCreatePageWithFolder();
  const addFolder = useCreateFolder();

  const {
    match: {
      params: { sectionId },
    },
    onUpdateSection,
    onDeleteSection,
    onMoveSection,
    onDuplicateSection,
    onChange,
    onUpdate,
    error,
    loading,
    section,
  } = props;

  useSetNavigationCallbacks(
    {
      onAddQuestionPage: () =>
        addFolderWithPage({ sectionId: section.id, position: 0 }),
      onAddCalculatedSummaryPage: () =>
        addFolderWithPage({
          sectionId: section.id,
          position: section.folders.length + 1,
          isCalcSum: true,
        }),
      onAddFolder: () =>
        addFolder({ sectionId: section.id, position: 0, enabled: true }),
    },
    [section]
  );

  const handleMoveSection = (args) => {
    setMoveSectionDialog(false);
    onMoveSection(args);
  };

  const handleDeleteSectionConfirm = () => {
    setShowDeleteConfirmDialog(false);
    onDeleteSection(sectionId);
  };

  const renderContent = () => {
    if (loading) {
      return <Loading height="24.25rem">Section loading…</Loading>;
    }
    if (error) {
      return <Error>Something went wrong</Error>;
    }
    if (isEmpty(section)) {
      return <Error>Oops! Section could not be found</Error>;
    }

    const { id, alias, questionnaire, position } = section;

    return (
      <>
        <Toolbar>
          <div>
            <Label htmlFor="alias">Short code</Label>
            <AliasEditor
              alias={alias}
              onUpdate={onUpdate}
              onChange={onChange}
            />
          </div>
          <Buttons>
            <Button
              onClick={() => setMoveSectionDialog(true)}
              data-test="btn-move"
              variant="tertiary"
              small
              disabled={questionnaire.questionnaireInfo.totalSectionCount === 1}
            >
              <IconText icon={IconMove}>Move</IconText>
            </Button>
            <DuplicateButton
              onClick={() =>
                onDuplicateSection({
                  sectionId: id,
                  position: position + 1,
                })
              }
              data-test="btn-duplicate-section"
            >
              Duplicate
            </DuplicateButton>
            <IconButtonDelete
              onClick={() => setShowDeleteConfirmDialog(true)}
              data-test="btn-delete"
            >
              Delete
            </IconButtonDelete>
          </Buttons>
        </Toolbar>
        <SectionEditor
          key={id}
          onUpdate={onUpdateSection}
          showDeleteConfirmDialog={showDeleteConfirmDialog}
          onCloseDeleteConfirmDialog={() => setShowDeleteConfirmDialog(false)}
          onDeleteSectionConfirm={handleDeleteSectionConfirm}
          showMoveSectionDialog={showMoveSectionDialog}
          onCloseMoveSectionDialog={() => setMoveSectionDialog(false)}
          onMoveSectionDialog={handleMoveSection}
          {...props}
          section={section}
        />
      </>
    );
  };

  const hasIntroductionContent = Boolean(
    section.introductionTitle || section.introductionContent
  );

  return (
    <EditorLayout
      onAddQuestionPage={() => addFolderWithPage({ sectionId, position: 0 })}
      data-test="section-route"
      preview={hasIntroductionContent}
      title={section.displayName || ""}
      validationErrorInfo={section.validationErrorInfo}
      logic={enableOn(["hub"])}
    >
      <Panel>{renderContent()}</Panel>
    </EditorLayout>
  );
};

UnwrappedSectionRoute.propTypes = propTypes;

const withSectionEditing = flowRight(
  withApollo,
  withCreateSection,
  withDuplicateSection,
  withUpdateSection,
  withDeleteSection,
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
      folders {
        id
      }
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
