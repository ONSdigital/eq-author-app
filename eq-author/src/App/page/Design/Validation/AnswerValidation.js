import React from "react";
import { kebabCase, get, startCase, isNull, find } from "lodash";
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

import NumericValidation from "./NumericValidation/index";

import DatePreview from "./DatePreview";
import DurationPreview from "./DurationPreview";
import {
  EARLIEST_BEFORE_LATEST_DATE,
  MAX_GREATER_THAN_MIN,
  DURATION_ERROR_MESSAGE,
  MIN_INCLUSIVE_TEXT,
  MAX_INCLUSIVE_TEXT,
  ERR_NO_VALUE,
} from "constants/validationMessages";

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

export const SidebarValidation = styled(SidebarButton)`
  &:not(:first-of-type) {
    margin-top: 0.5em;
  }
  margin-bottom: 0;
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

  titleText = (id, title, enabled, inclusive) => {
    if (!enabled) {
      return `Set ${title.toLowerCase()}`;
    }
    if (!inclusive && id.includes("Duration")) {
      return `${title} is`;
    }
    if (id.includes("max") || id.includes("latest")) {
      return `${title} ${MAX_INCLUSIVE_TEXT}`;
    } else {
      return `${title} ${MIN_INCLUSIVE_TEXT}`;
    }
  };

  renderPropertyError = (hasError, errorMessage, key = null) =>
    hasError && (
      <PropertiesError key={key} icon={WarningIcon}>
        {errorMessage}
      </PropertiesError>
    );

  renderButton = ({ id, title, value, enabled, hasError, inclusive, validationMessage, index, renderIsTrue }) => (
    <>
      <SidebarValidation
        key={id}
        data-test={`sidebar-button-${kebabCase(title)}`}
        onClick={() => {
          this.setState({ modalIsOpen: true, startingTabId: id });
        }}
        hasError={hasError}
      >
        <Title>{this.titleText(id, title, enabled, inclusive)}</Title>
        {enabled && !isNull(value) && <Detail>{value}</Detail>}
      </SidebarValidation>

      {hasError && renderIsTrue && (
        <PropertiesError key={index} icon={WarningIcon}>
          {validationMessage}
        </PropertiesError>
      )}
    </>
  );

  renderValidation = (validValidations, answer, errorsArr) => {
    let validationMessage = null;

    return validValidations.map((validationType, index) => {
      const validation = get(answer, `validation.${validationType.id}`, {});
      const errors = get(validation, `validationErrorInfo.errors`, []);

      const { id } = validationType;
      const { enabled, previousAnswer, metadata, inclusive } = validation;

      let renderIsTrue = false;

      if (answer.type === "DateRange") {
        if ((id === "latestDate" || id === "earliestDate") && enabled) {
          errorsArr.dateRange.range.push(...errors);
        }

        if ((id === "minDuration" || id === "maxDuration") && enabled) {
          errorsArr.dateRange.duration.push(...errors);
        }
      } else {
        errorsArr.other.push(...errors);
        renderIsTrue = true;

        const noValError = find(errorsArr.other, error =>
          error.errorCode.includes("ERR_NO_VALUE")
        );

        if (answer.type === "Date") {
          const maxError = find(errorsArr.other, error =>
            error.errorCode.includes("ERR_EARLIEST_AFTER_LATEST")
          );

          if (noValError || (noValError && maxError)) {
            validationMessage = ERR_NO_VALUE
          } else if (maxError) {
            if (id === "earliestDate") {
              renderIsTrue = false;
            }
            validationMessage = EARLIEST_BEFORE_LATEST_DATE
          }

        } else if (answer.type === "Number") {
          const maxError = find(errorsArr.other, error =>
            error.errorCode.includes("ERR_MIN_LARGER_THAN_MAX")
          );
          if (noValError || (noValError && maxError)) {
            validationMessage = ERR_NO_VALUE
          } else if (maxError) {
            if (id === "minValue") {
              renderIsTrue = false;
            }
            validationMessage = MAX_GREATER_THAN_MIN
          }
        }
      }

      const value = enabled ? validationType.preview(validation, answer) : null;

      return (
        <>
          {this.renderButton({
            ...validationType,
            value,
            enabled,
            previousAnswer,
            metadata,
            hasError: errors.length > 0,
            inclusive,
            validationMessage,
            index,
            renderIsTrue
          })}
          {/* <p key={index}>test **** {index}</p> */}
        </>
      )
    });
  };



  render() {
    const { answer } = this.props;
    const validValidationTypes = validations[answer.type] || [];

    if (validValidationTypes.length === 0) {
      return null;
    }

    const validationErrors = {
      dateRange: {
        duration: [],
        range: [],
      },
      other: [],
    };

    let validationButtons = [];

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

      const durationButtons = this.renderValidation(
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
        validationErrors.dateRange.duration.length > 1,
        DURATION_ERROR_MESSAGE,
        "duration-error"
      );

      const rangeError = this.renderPropertyError(
        validationErrors.dateRange.range.length > 1,
        EARLIEST_BEFORE_LATEST_DATE,
        "range-error"
      );

      validationButtons.push(rangeButtons);
      validationButtons.push(rangeError);

      validationButtons.push(durationButtons);
      validationButtons.push(durationError);
    } else {
      validationButtons = this.renderValidation(
        validValidationTypes,
        answer,
        validationErrors
      );
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
