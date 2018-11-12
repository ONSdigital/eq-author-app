import React, { Component } from "react";
import PropTypes from "prop-types";
import { flowRight } from "lodash";
import styled from "styled-components";

import Error from "components/Error";
import Loading from "components/Loading";
import GetMetadataQuery from "components/MetadataModal/GetMetadataQuery";
import DialogHeader from "components/Dialog/DialogHeader";
import { Heading, Message } from "components/Dialog/DialogMessage";
import ModalFullScreen from "components/ModalFullScreen";
import IconText from "components/IconText";
import MetadataTable from "components/MetadataTable";
import DialogActionButtons from "components/Dialog/DialogButtons";

import withCreateMetadata from "containers/enhancers/withCreateMetadata";
import withDeleteMetadata from "containers/enhancers/withDeleteMetadata";
import withUpdateMetadata from "containers/enhancers/withUpdateMetadata";

import InfoIcon from "./icon-info.svg?inline";

import { colors } from "constants/theme";

const CenteredHeading = styled(Heading)`
  text-align: center;
  margin: 2em 0 5em;
  color: ${colors.darkGrey};
`;

const Info = styled(IconText)`
  justify-content: left;
`;

const Scrollable = styled.div`
  padding: 0 8em 2em;
  max-width: 80em;
  margin: auto;
`;

const Content = styled.div`
  padding: 1em 0;
`;

export class UnwrappedMetadataModal extends Component {
  renderContent = ({ loading, error, data: { questionnaire } }) => {
    const {
      onAddMetadata,
      onDeleteMetadata,
      onUpdateMetadata,
      onClose
    } = this.props;

    if (loading) {
      return <Loading height="100%">Questionnaire metadata loading…</Loading>;
    }

    if (error) {
      return <Error>Oops! Something went wrong</Error>;
    }

    if (!questionnaire) {
      return <Error>Oops! Questionnaire could not be found</Error>;
    }

    return (
      <Scrollable data-test="metadata-modal-content">
        <DialogHeader>
          <Message>
            <CenteredHeading>Metadata</CenteredHeading>
          </Message>
        </DialogHeader>
        <Info icon={InfoIcon}>
          Metadata entered here are only used for the creation of this survey.
        </Info>
        <Content>
          <MetadataTable
            metadata={questionnaire.metadata}
            questionnaireId={questionnaire.id}
            onAdd={onAddMetadata}
            onDelete={onDeleteMetadata}
            onUpdate={onUpdateMetadata}
          />
        </Content>
        <DialogActionButtons primaryAction={onClose} primaryActionText="Done" />
      </Scrollable>
    );
  };

  render() {
    const { isOpen, onClose, questionnaireId } = this.props;

    return (
      <ModalFullScreen isOpen={isOpen} onClose={onClose}>
        <GetMetadataQuery questionnaireId={questionnaireId}>
          {this.renderContent}
        </GetMetadataQuery>
      </ModalFullScreen>
    );
  }
}

UnwrappedMetadataModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddMetadata: PropTypes.func.isRequired,
  onDeleteMetadata: PropTypes.func.isRequired,
  onUpdateMetadata: PropTypes.func.isRequired,
  questionnaireId: PropTypes.string.isRequired
};

export default flowRight(
  withCreateMetadata,
  withDeleteMetadata,
  withUpdateMetadata
)(UnwrappedMetadataModal);
