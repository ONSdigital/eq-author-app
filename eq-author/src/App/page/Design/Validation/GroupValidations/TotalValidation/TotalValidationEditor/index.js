import React from "react";
import { flowRight } from "lodash";
import styled from "styled-components";
import { propType } from "graphql-anywhere";
import PropTypes from "prop-types";

import { Select, Field, Label } from "components/Forms";
import { Grid, Column } from "components/Grid";
import withEntityEditor from "components/withEntityEditor";
import VisuallyHidden from "components/VisuallyHidden";
import ToggleSwitch from "components/buttons/ToggleSwitch";

import withChangeUpdate from "enhancers/withChangeUpdate";
import withPropRemapped from "enhancers/withPropRemapped";

import totalFragment from "graphql/fragments/total-validation-rule.graphql";

import { ValidationPills } from "../../../ValidationPills";
import ValidationTitle from "../../../ValidationTitle";
import PathEnd from "../../../path-end.svg?inline";
import withUpdateValidationRule from "../../../withUpdateValidationRule";
import { numericReadToWriteMapper } from "../../../readToWriteMapper";

import CustomEditor from "./CustomEditor";
import PreviousAnswerEditor from "./PreviousAnswerEditor";

const Connector = styled(PathEnd)`
  display: block;
  margin-left: auto;
`;

const Flex = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const Pills = styled(ValidationPills)`
  margin-top: 2em;
`;

const InlineField = styled(Field)`
  display: flex;
  align-items: center;
  margin-bottom: 0.4em;
  margin-left: 0.7em;

  > * {
    margin-bottom: 0;
  }
`;

export const TotalValidationEditor = ({
  total,
  type,
  onChange,
  onUpdate,
  onChangeUpdate,
  errors,
}) => {
  return (
    <>
      <Grid>
        <Column cols={4}>
          <Flex>
            <ValidationTitle style={{ margin: "0 1em 0 1em" }}>
              Total
            </ValidationTitle>
            <label htmlFor="condition">
              <VisuallyHidden>Condition</VisuallyHidden>
              <Select
                onChange={onChangeUpdate}
                aria-label="Total"
                id="condition"
                data-test="total-condition-select"
                defaultValue={total.condition}
              >
                <option value="Equal">(=) Equal to</option>
                <option value="GreaterThan">(&gt;) More than</option>
                <option value="LessThan">(&lt;) Less than</option>
                <option value="GreaterOrEqual">
                  (&ge;) More than or equal to
                </option>
                <option value="LessOrEqual">
                  (&le;) Less than or equal to
                </option>
              </Select>
            </label>
          </Flex>
          <Connector />
        </Column>
        <Column cols={8}>
          <Pills
            entityType={total.entityType}
            onEntityTypeChange={onChangeUpdate}
            PreviousAnswer={PreviousAnswerEditor}
            Custom={CustomEditor}
            total={total}
            errors={errors}
            type={type}
            onChange={onChange}
            onUpdate={onUpdate}
            onChangeUpdate={onChangeUpdate}
            data-test="total-pill-tabs"
          />
        </Column>
      </Grid>
      <InlineField>
        <Label>Do not apply if all values are unanswered</Label>
        <ToggleSwitch
          id="total-validation-toggle"
          name="total-validation-toggle"
          onChange={() => console.log("Total toggle")}
          hideLabels={false}
        />
      </InlineField>
    </>
  );
};

TotalValidationEditor.propTypes = {
  total: propType(totalFragment).isRequired,
  errors: PropTypes.arrayOf(
    PropTypes.shape({
      errorCode: PropTypes.string,
      field: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string,
    })
  ),
  type: PropTypes.string.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeUpdate: PropTypes.func.isRequired,
};

export default flowRight(
  withUpdateValidationRule,
  withPropRemapped("onUpdateValidationRule", "onUpdate", (entity) => [
    numericReadToWriteMapper("totalInput")(entity),
    entity,
  ]),
  withEntityEditor("total"),
  withChangeUpdate
)(TotalValidationEditor);
