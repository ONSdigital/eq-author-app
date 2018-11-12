import React from "react";
import PropTypes from "prop-types";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { flip, partial } from "lodash";

import RichTextEditor from "components/RichTextEditor";
import DeleteConfirmDialog from "components/DeleteConfirmDialog";
import withEntityEditor from "components/withEntityEditor";
import { Field, Label } from "components/Forms";
import WrappingInput from "components/WrappingInput";
import MoveSectionModal from "components/MoveSectionModal";
import MoveSectionQuery from "components/MoveSectionModal/MoveSectionQuery";
import CharacterCounter from "components/CharacterCounter";

import { colors, radius } from "constants/theme";

import getIdForObject from "utils/getIdForObject";

import sectionFragment from "graphql/fragments/section.graphql";

import iconSection from "./icon-dialog-section.svg";

const titleControls = {
  emphasis: true
};

const Padding = styled.div`
  padding: 2em 2em 0;
`;

const SectionCanvas = styled.div`
  padding: 0;
`;

const AliasField = styled(Field)`
  margin-bottom: 0.5em;
`;

const Alias = styled.div`
  padding: 0.5em;
  border: 1px solid ${colors.bordersLight};
  position: relative;
  border-radius: ${radius};

  &:focus-within {
    border-color: ${colors.blue};
    box-shadow: 0 0 0 1px ${colors.blue};
  }
`;

export class UnwrappedSectionEditor extends React.Component {
  static propTypes = {
    section: CustomPropTypes.section.isRequired,
    onChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDeleteSectionConfirm: PropTypes.func.isRequired,
    onCloseDeleteConfirmDialog: PropTypes.func.isRequired,
    showDeleteConfirmDialog: PropTypes.bool.isRequired,
    onMoveSectionDialog: PropTypes.func.isRequired,
    showMoveSectionDialog: PropTypes.bool.isRequired,
    onCloseMoveSectionDialog: PropTypes.func.isRequired,
    match: CustomPropTypes.match
  };

  renderMoveSectionModal = ({ loading, error, data }) => {
    const {
      onMoveSectionDialog,
      showMoveSectionDialog,
      onCloseMoveSectionDialog,
      section
    } = this.props;

    if (loading || error) {
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
      match
    } = this.props;
    const handleUpdate = partial(flip(onChange), onUpdate);

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
          <Alias>
            <AliasField>
              <Label htmlFor="section-alias">
                Section short code (optional)
              </Label>
              <WrappingInput
                id="section-alias"
                data-test="section-alias"
                name="alias"
                onChange={onChange}
                onBlur={onUpdate}
                value={section.alias}
                maxLength={255}
                autoFocus={!section.alias}
              />
            </AliasField>
            <CharacterCounter value={section.alias} limit={24} />
          </Alias>
        </Padding>
        <Padding>
          <RichTextEditor
            id="title"
            label="Title"
            value={section.title}
            onUpdate={handleUpdate}
            controls={titleControls}
            size="large"
            testSelector="txt-section-title"
          />
        </Padding>
      </SectionCanvas>
    );
  }
}

UnwrappedSectionEditor.fragments = {
  Section: sectionFragment
};

export default withEntityEditor("section", sectionFragment)(
  UnwrappedSectionEditor
);
