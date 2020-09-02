import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get, flowRight } from "lodash";

import { Grid, Column } from "components/Grid";
import { Number } from "components/Forms";

import PreviousAnswerContentPicker from "./PreviousAnswerContentPicker";
import { ValidationPills } from "./ValidationPills";
import ValidationTitle from "./ValidationTitle";
import PathEnd from "./path-end.svg?inline";
import withCustomNumberValueChange from "./withCustomNumberValueChange";
import FieldWithInclude from "./FieldWithInclude";

import * as entityTypes from "constants/validation-entity-types";
import withChangeUpdate from "enhancers/withChangeUpdate";
import ValidationError from "components/ValidationError";
import { colors } from "constants/theme";
import { ERR_NO_VALUE } from "constants/validationMessages";

const Connector = styled(PathEnd)`
  margin-top: 0.75em;
`;

const StyledNumber = styled(Number)`

  ${({ hasError }) =>
    hasError &&
    `
    border-color: ${colors.red};
    outline-color: ${colors.red};
    box-shadow: 0 0 0 2px ${colors.red};
    border-radius: 4px;
    margin-bottom: 0;
  `}
`;

const StyledError = styled(ValidationError)`
  width: 60%;
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
        selectedId={get(this.props.validation.previousAnswer, "id")}
        path={`answer.validation.${this.props.readKey}.availablePreviousAnswers`}
      />
    </FieldWithInclude>
  );

  Custom = (hasError) => (
    <>
      <FieldWithInclude
        id="inclusive"
        name="inclusive"
        onChange={this.props.onChangeUpdate}
        checked={this.props.validation.inclusive}
      >
        <StyledNumber
          hasError={hasError}
          default={null}
          data-test="numeric-value-input"
          value={this.props.validation.custom}
          type={this.props.answer.type}
          unit={this.props.answer.properties.unit}
          onChange={this.props.onCustomNumberValueChange}
          onBlur={this.props.onUpdate}
          max={this.props.limit}
          min={0 - this.props.limit}
        />
      </FieldWithInclude>
      {hasError && this.handleError()}
    </>
  );

  handleError = () => {
    return (<StyledError hasError>{ERR_NO_VALUE}</StyledError>);
  };


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
  limit: PropTypes.number.isRequired,
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
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    properties: PropTypes.shape({
      unit: PropTypes.string,
    }),
    validationErrorInfo: PropTypes.shape({
      errors: PropTypes.arrayOf(
        PropTypes.shape({
          errorCode: PropTypes.string,
          field: PropTypes.string,
          id: PropTypes.string,
          type: PropTypes.string,
        })
      ),
    }),
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
