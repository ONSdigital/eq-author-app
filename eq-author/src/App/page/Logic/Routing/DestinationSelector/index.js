import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import CustomPropTypes from "custom-prop-types";
import PropTypes from "prop-types";

import RoutingDestinationContentPicker from "./RoutingDestinationContentPicker";

import { Grid, Column } from "components/Grid";
import ValidationError from "components/ValidationError";

import { destinationErrors } from "constants/validationMessages";
import { colors } from "constants/theme";

const DESTINATION_TYPE = {
  Section: "Section",
  QuestionPage: "QuestionPage",
  CalculatedSummaryPage: "CalculatedSummaryPage",
  ListCollectorPage: "ListCollectorPage",
};

const RoutingRuleResult = styled.div`
  padding: 0.5em 0.5em 0.5em 1.5em;
  background: ${colors.lightMediumGrey};
  border-left: 5px solid ${colors.primary};
`;

const Label = styled.label`
  width: 100%;
  display: block;
  font-size: 0.9em;
  font-weight: bold;
  &[disabled] {
    opacity: 0.5;
  }
`;

const Goto = styled.span`
  float: right;
  margin-right: 1em;
`;

const ErrorContainer = styled.div`
  margin-left: 1.5em;
`;

const typeToPropertyName = {
  [DESTINATION_TYPE.Section]: "sectionId",
  [DESTINATION_TYPE.QuestionPage]: "pageId",
  [DESTINATION_TYPE.CalculatedSummaryPage]: "pageId",
  [DESTINATION_TYPE.ListCollectorPage]: "pageId",
};

export const UnwrappedDestinationSelector = ({
  label,
  id,
  disabled,
  value,
  match,
  onChange,
}) => {
  const handleChange = ({ value: { __typename: type, id } }) => {
    const destinationProperty = typeToPropertyName[type] ?? "logical";
    onChange({
      [destinationProperty]: id,
    });
  };

  const errors = value?.validationErrorInfo?.errors;
  const errorMessage = destinationErrors[errors?.[0]?.errorCode]?.message;

  return (
    <>
      <RoutingRuleResult key={id}>
        <Grid align="center">
          <Column gutters={false} cols={5}>
            <Label htmlFor={id} disabled={disabled}>
              {label} <Goto>Go to: </Goto>
            </Label>
          </Column>
          <Column gutters={false} cols={7}>
            <RoutingDestinationContentPicker
              id={id}
              pageId={match.params.pageId}
              selected={value}
              onSubmit={handleChange}
              disabled={disabled}
              data-test="routing-destination-content-picker"
              hasError={Boolean(errorMessage)}
            />
          </Column>
        </Grid>
      </RoutingRuleResult>
      {errorMessage && (
        <ErrorContainer>
          <ValidationError
            variant="destination"
            test="destination-validation-error"
          >
            {errorMessage}
          </ValidationError>
        </ErrorContainer>
      )}
    </>
  );
};

UnwrappedDestinationSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  disabled: PropTypes.bool.isRequired,
  match: CustomPropTypes.match.isRequired,
  validationErrors: PropTypes.array, // eslint-disable-line react/forbid-prop-types
};

UnwrappedDestinationSelector.defaultProps = {
  disabled: false,
  loading: false,
};

export default withRouter(UnwrappedDestinationSelector);
