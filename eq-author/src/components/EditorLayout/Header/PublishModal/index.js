import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useLazyQuery } from "@apollo/react-hooks";
import { get } from "lodash";
import styled from "styled-components";
import CustomPropTypes from "custom-prop-types";

import Modal from "components/modals/Modal";
import DialogHeader from "components/Dialog/DialogHeader";
import { Message, Heading } from "components/Dialog/DialogMessage";
import { Field, Input, Label } from "components/Forms";
import ButtonGroup from "components/buttons/ButtonGroup";
import Button from "components/buttons/Button";
import InformationBox from "components/InformationBox";
import { Grid, Column } from "components/Grid";

import TRIGGER_PUBLISH_QUERY from "./publishQuestionnaire.graphql";

const StyledModal = styled(Modal)`
  .Modal {
    width: 38em;
  }
`;
const CenteredHeading = styled(Heading)`
  text-align: center;
  margin-bottom: 1rem;
`;

const StyledGrid = styled(Grid)`
  padding: 1em 1.5em 0;
  border: 1px solid #d6d8da;
  margin: 0.5em 0;
`;

const PublishModal = ({ isOpen, onClose, questionnaire }) => {
  const originalInputs = { surveyId: "", formType: "" };
  const [inputs, setInputs] = useState(originalInputs);
  const [triggerPublish, { data }] = useLazyQuery(TRIGGER_PUBLISH_QUERY, {
    fetchPolicy: "no-cache",
  });

  const handleInputChange = event => {
    setInputs({
      ...inputs,
      [event.name]: event.value,
    });
  };

  useEffect(() => {
    const launchUrl = get(data, "triggerPublish.launchUrl");
    if (launchUrl && isOpen) {
      setInputs(originalInputs);
      onClose();
      window.alert(`Your survey has been published at: ${launchUrl}`);
    }
  }, [data]);

  return (
    <StyledModal isOpen={isOpen} onClose={onClose}>
      <DialogHeader>
        <Message>
          <CenteredHeading>
            <div>Publish questionnaire</div>
          </CenteredHeading>
        </Message>
      </DialogHeader>
      <StyledGrid>
        <Column cols={6}>
          <Field>
            <Label htmlFor="surveyId">Survey ID</Label>
            <Input
              id="surveyId"
              onChange={handleInputChange}
              value={inputs.surveyId}
              data-test="survey-id-input"
            />
          </Field>
        </Column>
        <Column cols={6}>
          <Field>
            <Label htmlFor="formType">Form type</Label>
            <Input
              id="formType"
              onChange={handleInputChange}
              value={inputs.formType}
              data-test="form-type-input"
            />
          </Field>
        </Column>
      </StyledGrid>
      <InformationBox headerText="Important information">
        No further changes can be made to the questionnaire after it has been
        sent for approval.
      </InformationBox>
      <ButtonGroup horizontal align="right">
        <Button
          onClick={onClose}
          variant="secondary"
          type="button"
          data-test="publish-cancel-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!(inputs.surveyId && inputs.formType)}
          onClick={() =>
            triggerPublish({
              variables: {
                input: {
                  questionnaireId: questionnaire.id,
                  surveyId: inputs.surveyId,
                  formType: inputs.formType,
                },
              },
            })
          }
        >
          Submit for approval
        </Button>
      </ButtonGroup>
    </StyledModal>
  );
};

PublishModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  questionnaire: CustomPropTypes.questionnaire.isRequired,
};

export default PublishModal;
