import React from "react";
import PropTypes from "prop-types";

import { Grid, Column } from "components/Grid";

import DisabledMessage from "App/QuestionPage/Design/Validation/DisabledMessage";
import ValidationView from "App/QuestionPage/Design/Validation/ValidationView";
import Duration from "App/QuestionPage/Design/Validation/Date/Duration";
import EmphasisedText from "App/QuestionPage/Design/Validation/Date/EmphasisedText";
import AlignedColumn from "App/QuestionPage/Design/Validation/Date/AlignedColumn";

import { DAYS, MONTHS, YEARS } from "constants/durations";

const UNITS = [DAYS, MONTHS, YEARS];

class DurationValidation extends React.Component {
  handleToggleChange = ({ value: enabled }) => {
    const {
      onToggleValidationRule,
      duration: { id }
    } = this.props;

    onToggleValidationRule({
      id,
      enabled
    });
  };

  renderContent = () => {
    const {
      duration: { duration },
      displayName,
      onChange,
      onUpdate
    } = this.props;

    return (
      <div>
        <Grid>
          <AlignedColumn cols={3}>
            <EmphasisedText>{displayName} is</EmphasisedText>
          </AlignedColumn>
          <Column cols={9}>
            <Duration
              name="duration"
              duration={duration}
              units={UNITS}
              onChange={onChange}
              onUpdate={onUpdate}
            />
          </Column>
        </Grid>
      </div>
    );
  };

  renderDisabled = () => <DisabledMessage name={this.props.displayName} />;

  render() {
    const {
      testId,
      duration: { enabled }
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

DurationValidation.propTypes = {
  displayName: PropTypes.string.isRequired,
  duration: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enabled: PropTypes.bool.isRequired,
    duration: PropTypes.shape({
      unit: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  answer: PropTypes.shape({
    id: PropTypes.string.required,
    properties: PropTypes.shape({
      format: PropTypes.string
    }).isRequired
  }).isRequired,
  onToggleValidationRule: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired
};

export default DurationValidation;
