import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get } from "lodash";

import { Input, Number, Select } from "components/Forms";
import { Grid, Column } from "components/Grid";
import ContentPickerSelect from "components/ContentPickerSelect";
import { ANSWER, METADATA } from "components/ContentPickerSelect/content-types";

import DisabledMessage from "components/Validation/DisabledMessage";
import { ValidationPills } from "components/Validation/ValidationPills";
import ValidationView from "components/Validation/ValidationView";
import Path from "components/Validation/path.svg?inline";
import PathEnd from "components/Validation/path-end.svg?inline";

import * as entityTypes from "constants/validation-entity-types";
import { DATE } from "constants/metadata-types";

const UNITS = ["Days", "Months", "Years"];
const RELATIVE_POSITIONS = ["Before", "After"];

const DateInput = styled(Input)`
  width: 12em;
  height: 2.25em;
`;

const ConnectedPath = styled(Path)`
  height: 3.6em;
`;

const AlignedColumn = styled(Column)`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const RelativePositionSelect = styled(Select)`
  width: 6em;
`;

const EmphasisedText = styled.p`
  font-size: 0.9em;
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
`;

const StartDateText = styled.div`
  margin: 0;
  padding-top: 0.4em;
`;

const START_COL_SIZE = 3;
const END_COL_SIZE = 12 - START_COL_SIZE;

const getUnits = format => {
  if (format === "dd/mm/yyyy") {
    return UNITS;
  }

  if (format === "mm/yyyy") {
    return UNITS.slice(1);
  }

  return UNITS.slice(2);
};

class DateValidation extends React.Component {
  Metadata = () => (
    <ContentPickerSelect
      name="metadata"
      onSubmit={this.handleUpdate}
      contentTypes={[METADATA]}
      metadataTypes={[DATE]}
      selectedContentDisplayName={get(this.props.date.metadata, "displayName")}
    />
  );

  PreviousAnswer = () => (
    <ContentPickerSelect
      name="previousAnswer"
      onSubmit={this.handleUpdate}
      answerTypes={[DATE]}
      contentTypes={[ANSWER]}
      selectedContentDisplayName={get(
        this.props.date.previousAnswer,
        "displayName"
      )}
    />
  );

  Now = () => (
    <StartDateText>The date the respondent begins the survey</StartDateText>
  );

  Custom = () => (
    <DateInput
      name="customDate"
      type="date"
      value={this.props.date.customDate}
      onChange={this.props.onChange}
      onBlur={this.props.onUpdate}
      max="9999-12-30"
      min="1000-01-01"
    />
  );

  handleUpdate = update => this.props.onChange(update, this.props.onUpdate);

  handleEntityTypeChange = value =>
    this.handleUpdate({ name: "entityType", value });

  handleToggleChange = ({ value: enabled }) => {
    const {
      onToggleValidationRule,
      date: { id }
    } = this.props;

    onToggleValidationRule({
      id,
      enabled
    });
  };

  renderContent = () => {
    const {
      date: { offset, relativePosition, entityType },
      answer: {
        properties: { format }
      },
      displayName,
      onChange,
      onUpdate
    } = this.props;

    const availableUnits = getUnits(format);
    const offsetUnitIsInvalid = !availableUnits.includes(offset.unit);

    return (
      <div>
        <Grid>
          <AlignedColumn cols={START_COL_SIZE}>
            <EmphasisedText>{displayName} is</EmphasisedText>
          </AlignedColumn>
          <Column cols={END_COL_SIZE}>
            <Grid>
              <Column cols={2}>
                <Number
                  id="offset-value"
                  name="offset.value"
                  value={offset.value}
                  onChange={onChange}
                  onBlur={onUpdate}
                  max={99999}
                  min={0}
                />
              </Column>
              <Column cols={4}>
                <Select
                  name="offset.unit"
                  value={!offsetUnitIsInvalid ? offset.unit : ""}
                  onChange={onChange}
                  onBlur={onUpdate}
                  data-test="offset-unit-select"
                >
                  {offsetUnitIsInvalid && (
                    <option key="Please select" value="" disabled>
                      Please select…
                    </option>
                  )}
                  {availableUnits.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </Select>
              </Column>
            </Grid>
          </Column>
        </Grid>
        <Grid>
          <Column cols={START_COL_SIZE}>
            <ConnectedPath />
          </Column>
        </Grid>
        <Grid>
          <AlignedColumn cols={START_COL_SIZE}>
            <RelativePositionSelect
              name="relativePosition"
              value={relativePosition}
              onChange={onChange}
              onBlur={onUpdate}
              data-test="relative-position-select"
            >
              {RELATIVE_POSITIONS.map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </RelativePositionSelect>
            <PathEnd />
          </AlignedColumn>
          <Column cols={9}>
            <ValidationPills
              entityType={entityType}
              onEntityTypeChange={this.handleEntityTypeChange}
              PreviousAnswer={this.PreviousAnswer}
              Metadata={this.Metadata}
              Custom={this.Custom}
              Now={this.Now}
            />
          </Column>
        </Grid>
      </div>
    );
  };

  renderDisabled = () => (
    <DisabledMessage>{this.props.displayName} is disabled</DisabledMessage>
  );

  render() {
    const {
      testId,
      date: { enabled }
    } = this.props;

    return (
      <ValidationView
        data-test={testId}
        enabled={enabled}
        onToggleChange={this.handleToggleChange}
      >
        {enabled ? this.renderContent() : this.renderDisabled()}
      </ValidationView>
    );
  }
}

DateValidation.propTypes = {
  date: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    customDate: PropTypes.string,
    previousAnswer: PropTypes.shape({
      displayName: PropTypes.string.isRequired
    }),
    metadata: PropTypes.shape({
      displayName: PropTypes.string.isRequired
    }),
    offset: PropTypes.shape({
      unit: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    }).isRequired,
    relativePosition: PropTypes.string.isRequired,
    entityType: PropTypes.oneOf(Object.values(entityTypes)).isRequired
  }).isRequired,
  answer: PropTypes.shape({
    properties: PropTypes.shape({
      format: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  displayName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired
};

export default DateValidation;
