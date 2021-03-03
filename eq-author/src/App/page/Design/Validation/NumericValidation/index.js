import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { flowRight } from "lodash";
import { Grid, Column } from "components/Grid";
import * as entityTypes from "constants/validation-entity-types";
import withChangeUpdate from "enhancers/withChangeUpdate";

import { ValidationPills } from "../ValidationPills";
import ValidationTitle from "../ValidationTitle";
import PathEnd from "../path-end.svg?inline";
import withCustomNumberValueChange from "../withCustomNumberValueChange";
import CustomEditor from "./CustomEditor";
import PreviousAnswerEditor from "../PreviousAnswerEditor";

const Connector = styled(PathEnd)`
  display: block;
  margin-left: auto;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Pills = styled(ValidationPills)`
  margin-top: 2em;
`;

const UnwrappedNumericValidation = ({
  answer,
  validation,
  validation: { entityType },
  onChange,
  onUpdate,
  displayName,
  onChangeUpdate,
  onCustomNumberValueChange,
  limit,
  readKey,
}) => {
  return (
    <Grid>
      <Column cols={3}>
        <Flex>
          <ValidationTitle>{displayName} is</ValidationTitle>
        </Flex>
        <Connector />
      </Column>
      <Column cols={8}>
        <Pills
          entityType={entityType}
          onEntityTypeChange={onChangeUpdate}
          PreviousAnswer={PreviousAnswerEditor}
          Custom={CustomEditor}
          errors={answer.validationErrorInfo.errors}
          validation={validation}
          answer={answer}
          onChange={onChange}
          onUpdate={onUpdate}
          onCustomNumberValueChange={onCustomNumberValueChange}
          onChangeUpdate={onChangeUpdate}
          data-test="value-pill-tabs"
          limit={limit}
          readKey={readKey}
        />
      </Column>
    </Grid>
  );
};

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
      id: PropTypes.string,
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
  errors: PropTypes.shape({
    id: PropTypes.string,
    errors: PropTypes.arrayOf(
      PropTypes.shape({
        errorCode: PropTypes.string,
        field: PropTypes.string,
        id: PropTypes.string,
        type: PropTypes.string,
      })
    ),
    totalCount: PropTypes.number,
  }),
};

UnwrappedNumericValidation.defaultProps = {
  validation: {
    custom: null,
  },
};

export default flowRight(
  withCustomNumberValueChange,
  withChangeUpdate
)(UnwrappedNumericValidation);
