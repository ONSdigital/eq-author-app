import React, { useState, useCallback } from "react";
import { kebabCase, get, startCase, isNull, find } from "lodash";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import { colors } from "constants/theme";
import ModalWithNav from "components/modals/ModalWithNav";
import { unitConversion } from "constants/unit-types";
import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";
import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";
import VisuallyHidden from "components/VisuallyHidden";

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

const errorCodes = {
  ERR_EARLIEST_AFTER_LATEST: EARLIEST_BEFORE_LATEST_DATE,
  ERR_MIN_LARGER_THAN_MAX: MAX_GREATER_THAN_MIN,
  ERR_MAX_DURATION_TOO_SMALL: DURATION_ERROR_MESSAGE,
  ERR_NO_VALUE: ERR_NO_VALUE,
};

const titleText = (id, title, enabled, inclusive) => {
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

const AnswerValidation = ({ answer }) => {
  const [startingTabId, setStartingTabId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const modalId = `modal-validation-${answer.id}`;

  const handleModalClose = useCallback(() => setModalIsOpen(false), []);
  const validValidationTypes = getValidationsForType(answer.type);

  if (validValidationTypes.length === 0) {
    return;
  }

  const validationButtons = [];
  let pendingErrors = [];

  validValidationTypes.forEach(type => {
    const validation = get(answer, `validation.${type.id}`, {});
    const errors = get(validation, `validationErrorInfo.errors`, []);

    const { enabled, inclusive } = validation;
    const value = enabled ? type.preview(validation, answer) : null;

    const onClick = () => {
      setModalIsOpen(true);
      setStartingTabId(type.id);
    };

    validationButtons.push(
      <SidebarValidation
        id={type.id}
        key={type.id}
        data-test={`sidebar-button-${kebabCase(type.title)}`}
        onClick={onClick}
        hasError={errors.length > 0}
      >
        <Title>{titleText(type.id, type.title, enabled, inclusive)}</Title>
        {enabled && !isNull(value) && <Detail>{value}</Detail>}
      </SidebarValidation>
    );

    pendingErrors.push(...errors);

    const noValError = find(pendingErrors, error =>
      error.errorCode.includes("ERR_NO_VALUE")
    );

    if (pendingErrors.length > 0) {
      if (
        (type.id === "earliestDate" && !noValError) ||
        (type.id === "minDuration" && !noValError) ||
        (type.id === "minValue" && !noValError)
      ) {
        return; // Don't display anything after the earliest date / min duration buttons - show after section
      }

      // Only show one error - ERR_NO_VALUE takes precedence
      pendingErrors.sort(error =>
        error.errorCode === "ERR_NO_VALUE" ? -1 : 0
      );
      const error = pendingErrors[0];
      pendingErrors = [];

      validationButtons.push(
        <PropertiesError role="alert" icon={WarningIcon} key={error.id}>
          <VisuallyHidden>Error:&nbsp;</VisuallyHidden>
          {errorCodes[error.errorCode]}
        </PropertiesError>
      );
    }
  });

  return (
    <ValidationContext.Provider value={{ answer }}>
      {validationButtons}
      <ModalWithNav
        id={modalId}
        onClose={handleModalClose}
        navItems={validValidationTypes}
        title={`${startCase(answer.type)} validation`}
        isOpen={modalIsOpen}
        startingTabId={startingTabId}
      />
    </ValidationContext.Provider>
  );
};

AnswerValidation.propTypes = {
  answer: CustomPropTypes.answer,
};

export default React.memo(AnswerValidation);
