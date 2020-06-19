import React from "react";
import { kebabCase, get, startCase, isNull } from "lodash";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";
import ModalWithNav from "components/modals/ModalWithNav";
import { unitConversion } from "constants/unit-types";
import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";
import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";

import ValidationContext from "./ValidationContext";
import DurationValidation from "./DurationValidation";
import DateValidation from "./DateValidation";
import NumericValidation from "./NumericValidation";
import DatePreview from "./DatePreview";
import DurationPreview from "./DurationPreview";

import {
  EarliestDate,
  LatestDate,
  MinDuration,
  MaxDuration,
  MinValue,
  MaxValue,
} from "./";

import {
  CURRENCY,
  DATE,
  DATE_RANGE,
  NUMBER,
  PERCENTAGE,
  UNIT,
} from "constants/answer-types";

export const MIN_INCLUSIVE_TEXT = "must be more than";
export const MAX_INCLUSIVE_TEXT = "must be less than";

const formatValue = (value, { type, properties }) => {
  if (typeof value !== "number") {
    return null;
  }
  if (type === PERCENTAGE) {
    return `${value}%`;
  }
  if (type === CURRENCY) {
    return `£${value}`;
  }
  if (type === UNIT) {
    return `${value} ${unitConversion[properties.unit].abbreviation}`;
  }
  return value;
};

export const validationTypes = [
  {
    id: "minValue",
    title: "Min value",
    render: () => (
      <MinValue>{props => <NumericValidation {...props} />}</MinValue>
    ),
    types: [CURRENCY, NUMBER, PERCENTAGE, UNIT],
    preview: ({ custom, previousAnswer, entityType }, answer) =>
      entityType === "Custom"
        ? formatValue(custom, answer)
        : get(previousAnswer, "displayName"),
  },
  {
    id: "maxValue",
    title: "Max value",
    render: () => (
      <MaxValue>{props => <NumericValidation {...props} />}</MaxValue>
    ),
    types: [CURRENCY, NUMBER, PERCENTAGE, UNIT],
    preview: ({ custom, previousAnswer, entityType }, answer) =>
      entityType === "Custom"
        ? formatValue(custom, answer)
        : get(previousAnswer, "displayName"),
  },
  {
    id: "earliestDate",
    title: "Earliest date",
    render: () => (
      <EarliestDate>{props => <DateValidation {...props} />}</EarliestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "latestDate",
    title: "Latest date",
    render: () => (
      <LatestDate>{props => <DateValidation {...props} />}</LatestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "minDuration",
    title: "Min duration",
    render: () => (
      <MinDuration>{props => <DurationValidation {...props} />}</MinDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
  {
    id: "maxDuration",
    title: "Max duration",
    render: () => (
      <MaxDuration>{props => <DurationValidation {...props} />}</MaxDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
];

const getValidationsForType = type =>
  validationTypes.filter(({ types }) => types.includes(type));

const validations = [
  NUMBER,
  CURRENCY,
  PERCENTAGE,
  DATE,
  DATE_RANGE,
  UNIT,
].reduce(
  (hash, type) => ({
    ...hash,
    [type]: getValidationsForType(type),
  }),
  {}
);

const PropertiesError = styled(IconText)`
  color: ${colors.red};
  justify-content: left;
`;

const SidebarValidation = styled(SidebarButton)`
  &:not(:first-of-type) {
    margin-top: 0.5em;
  }
`;

class AnswerValidation extends React.PureComponent {
  state = {
    startingTabId: null,
    modalIsOpen: false,
  };

  constructor(props) {
    super(props);
    this.modalId = `modal-validation-${props.answer.id}`;
  }

  handleModalClose = () => this.setState({ modalIsOpen: false });

  renderButton = ({ id, title, value, enabled, hasError, inclusive }) => (
    <SidebarValidation
      key={id}
      data-test={`sidebar-button-${kebabCase(title)}`}
      onClick={() => {
        this.setState({ modalIsOpen: true, startingTabId: id });
      }}
      hasError={hasError}
    >
      <Title>
        {title}{" "}
        {enabled &&
          !inclusive &&
          (id.includes("max") ? MAX_INCLUSIVE_TEXT : MIN_INCLUSIVE_TEXT)}
      </Title>
      {enabled && !isNull(value) && <Detail>{value}</Detail>}
    </SidebarValidation>
  );

  renderValidation = (validValidations, answer, errorsArr) => {
    return validValidations.map(validationType => {
      const validation = get(answer, `validation.${validationType.id}`, {});
      const errors = get(validation, `validationErrorInfo.errors`, []);

      const { id } = validationType;
      const { enabled, previousAnswer, metadata, inclusive } = validation;

      if (answer.type === "DateRange") {
        if ((id === "latestDate" || id === "earliestDate") && enabled) {
          errorsArr.dateRange.range++;
        }

        if ((id === "minDuration" || id === "maxDuration") && enabled) {
          errorsArr.dateRange.duration++;
        }
      }

      errorsArr.other.push(...errors);

      const value = enabled ? validationType.preview(validation, answer) : "";

      return this.renderButton({
        ...validationType,
        value,
        enabled,
        previousAnswer,
        metadata,
        hasError: errors.length > 0,
        inclusive,
      });
    });
  };

  renderPropertyError = (hasError, errorMessage, key = null) =>
    hasError && (
      <PropertiesError key={key} icon={WarningIcon}>
        {errorMessage}
      </PropertiesError>
    );

  render() {
    const { answer } = this.props;
    const validValidationTypes = validations[answer.type] || [];

    const durationErrorMessage =
      "Enter a min duration that is shorter than the max";
    const rangeErrorMessage =
      "Enter an earliest date that is before the latest date";

    if (validValidationTypes.length === 0) {
      return null;
    }

    const validationErrors = {
      dateRange: {
        duration: 0,
        range: 0,
      },
      other: [],
    };

    let validationButtons = null;

    if (answer.type === "DateRange") {
      const { duration, range } = validValidationTypes.reduce(
        (accumulator, current) => {
          const { id } = current;
          if (id === "minDuration" || id === "maxDuration") {
            if (!accumulator.duration) {
              accumulator.duration = [];
            }
            accumulator.duration.push(current);
          }
          if (id === "earliestDate" || id === "latestDate") {
            if (!accumulator.range) {
              accumulator.range = [];
            }
            accumulator.range.push(current);
          }
          return accumulator;
        },
        {}
      );

      validationButtons = this.renderValidation(
        duration,
        answer,
        validationErrors
      );

      const rangeButtons = this.renderValidation(
        range,
        answer,
        validationErrors
      );

      const durationError = this.renderPropertyError(
        validationErrors.dateRange.duration > 1,
        durationErrorMessage,
        "duration-error"
      );

      const rangeError = this.renderPropertyError(
        validationErrors.dateRange.range > 1,
        rangeErrorMessage,
        "range-error"
      );

      validationButtons.push(rangeError);
      validationButtons.push(rangeButtons);
      validationButtons.push(durationError);
    } else {
      const validationMessage =
        answer.type === "Date"
          ? "Enter an earliest date that is before the latest date"
          : "Enter a max value that is greater than min value";

      validationButtons = this.renderValidation(
        validValidationTypes,
        answer,
        validationErrors
      );

      const propertyError = this.renderPropertyError(
        validationErrors.other.length > 0,
        validationMessage
      );
      validationButtons.push(propertyError);
    }

    return (
      <ValidationContext.Provider value={{ answer }}>
        {validationButtons}
        <ModalWithNav
          id={this.modalId}
          onClose={this.handleModalClose}
          navItems={validValidationTypes}
          title={`${startCase(answer.type)} validation`}
          isOpen={this.state.modalIsOpen}
          startingTabId={this.state.startingTabId}
        />
      </ValidationContext.Provider>
    );
  }
}

AnswerValidation.propTypes = {
  answer: CustomPropTypes.answer,
};

export default AnswerValidation;
