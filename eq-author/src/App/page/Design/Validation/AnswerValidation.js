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

const PropertiesError = styled(IconText)`
  color: ${colors.red};
  justify-content: left;
`;

export const SidebarValidation = styled(SidebarButton)`
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

  renderButton = ({ id, title, value, enabled, hasError, inclusive }) => (
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
  );

  renderValidation = (validValidations, answer, errorsArr) => {
    return validValidations.map(validationType => {
      const validation = get(answer, `validation.${validationType.id}`, {});
      const errors = get(validation, `validationErrorInfo.errors`, []);

      const { enabled, previousAnswer, metadata, inclusive } = validation;

      errorsArr.push(...errors);

      const value = enabled ? validationType.preview(validation, answer) : null;

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
    const validValidationTypes = getValidationsForType(answer.type);

    if (validValidationTypes.length === 0) {
      return null;
    }

    const validationErrors = [];
    let validationButtons = [];

    validValidationTypes.forEach(type => {
      let validationMessage;
      validationButtons.push(this.renderValidation([type], answer, validationErrors));
      
      if(type.id === "earliestDate" || type.id === "minDuration") {
        return; // Don't display anything after the earliest date / min duration buttons - show after section
      }
      
      if (type.id === "maxDuration") {
        validationMessage = DURATION_ERROR_MESSAGE;
      }
      else if (type.id === "latestDate") {
        validationMessage = EARLIEST_BEFORE_LATEST_DATE;
      }
      else if (answer.type == "Date") {
        validationMessage = EARLIEST_BEFORE_LATEST_DATE;
      }
      else if (find(validationErrors, error => error.errorCode.include("ERR_NO_VALUE"))) {
          validationMessage = ERR_NO_VALUE;
      } else {
        validationMessage = MAX_GREATER_THAN_MIN;
      }

      validationButtons.push(this.renderPropertyError(
        validationErrors.length > 0,
        validationMessage
      ));
    });

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
