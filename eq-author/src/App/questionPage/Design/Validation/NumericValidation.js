import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get, flowRight } from "lodash";

import { Grid, Column } from "components/Grid";

import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import { ValidationPills } from "./ValidationPills";
import ValidationTitle from "./ValidationTitle";
import ValidationInput from "./ValidationInput";
import PathEnd from "./path-end.svg?inline";
import withCustomNumberValueChange from "./withCustomNumberValueChange";
import FieldWithInclude from "./FieldWithInclude";

import * as entityTypes from "constants/validation-entity-types";
import withChangeUpdate from "enhancers/withChangeUpdate";

const Connector = styled(PathEnd)`
  margin-top: 0.75em;
`;

export class UnwrappedNumericValidation extends React.Component {
  PreviousAnswer = () => (
    <FieldWithInclude
      id="inclusive"
      name="inclusive"
      onChange={this.props.onChangeUpdate}
      checked={this.props.validation.inclusive}
    >
      <PreviousAnswerContentPicker
        answerId={this.props.answer.id}
        onSubmit={this.props.onChangeUpdate}
        selectedContentDisplayName={get(
          this.props.validation.previousAnswer,
          "displayName"
        )}
        path={`answer.validation.${
          this.props.readKey
        }.availablePreviousAnswers`}
      />
    </FieldWithInclude>
  );

  Custom = () => (
    <FieldWithInclude
      id="inclusive"
      name="inclusive"
      onChange={this.props.onChangeUpdate}
      checked={this.props.validation.inclusive}
    >
      <ValidationInput
        data-test="numeric-value-input"
        value={this.props.validation.custom}
        type="number"
        onChange={this.props.onCustomNumberValueChange}
        onBlur={this.props.onUpdate}
        max={this.props.limit}
        min={0 - this.props.limit}
      />
    </FieldWithInclude>
  );

  render() {
    const {
      validation: { entityType },
      displayName,
      onChangeUpdate,
    } = this.props;

    return (
      <Grid>
        <Column cols={3}>
          <ValidationTitle>{displayName} is</ValidationTitle>
          <Connector />
        </Column>
        <Column cols={8}>
          <ValidationPills
            entityType={entityType}
            onEntityTypeChange={onChangeUpdate}
            PreviousAnswer={this.PreviousAnswer}
            Custom={this.Custom}
          />
        </Column>
      </Grid>
    );
  }
}

UnwrappedNumericValidation.propTypes = {
  limit: PropTypes.number,
  validation: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    custom: PropTypes.number,
    inclusive: PropTypes.bool.isRequired,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
    }),
    entityType: PropTypes.oneOf(Object.values(entityTypes)),
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string,
    }).isRequired,
  }).isRequired,
  onCustomNumberValueChange: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  readKey: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
};

export default flowRight(
  withCustomNumberValueChange,
  withChangeUpdate
)(UnwrappedNumericValidation);
