import React, { useState, useMemo, useCallback } from "react";
import { kebabCase, get, startCase } from "lodash";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";

import ModalWithNav from "components/modals/ModalWithNav";
import { unitConversion } from "constants/unit-types";
import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";

import ValidationContext from "./ValidationContext";
import DurationValidation from "./DurationValidation";
import DateValidation from "./DateValidation";

import NumericValidation from "./NumericValidation/index";
import ValidationError from "components/ValidationError";

import DatePreview from "./DatePreview";
import DurationPreview from "./DurationPreview";
import {
  EARLIEST_BEFORE_LATEST_DATE,
  MAX_GREATER_THAN_MIN,
  DURATION_ERROR_MESSAGE,
  MIN_INCLUSIVE_TEXT,
  MAX_INCLUSIVE_TEXT,
  ERR_OFFSET_NO_VALUE,
  ERR_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
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
    return `${value} ${unitConversion[properties.unit]?.abbreviation || ""}`;
  }
  return value;
};

export const validationTypes = [
  {
    id: "minValue",
    title: "Min value",
    render: () => (
      <MinValue>{(props) => <NumericValidation {...props} />}</MinValue>
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
      <MaxValue>{(props) => <NumericValidation {...props} />}</MaxValue>
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
      <EarliestDate>{(props) => <DateValidation {...props} />}</EarliestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "latestDate",
    title: "Latest date",
    render: () => (
      <LatestDate>{(props) => <DateValidation {...props} />}</LatestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "minDuration",
    title: "Min duration",
    render: () => (
      <MinDuration>{(props) => <DurationValidation {...props} />}</MinDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
  {
    id: "maxDuration",
    title: "Max duration",
    render: () => (
      <MaxDuration>{(props) => <DurationValidation {...props} />}</MaxDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
];

const getValidationsForType = (type) =>
  validationTypes.filter(({ types }) => types.includes(type));

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
  ERR_OFFSET_NO_VALUE,
  ERR_REFERENCE_MOVED,
  ERR_REFERENCE_DELETED,
};

const renderError = (error) => (
  <ValidationError right={false} key={error.id}>
    {errorCodes[error.errorCode]}
  </ValidationError>
);

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
  const validValidationTypes = useMemo(
    () => getValidationsForType(answer.type),
    [answer]
  );

  if (!validValidationTypes.length) {
    return null;
  }

  const validationComponents = [];

  for (let i = 0; i < validValidationTypes.length; i += 2) {
    const minimumType = validValidationTypes[i];
    const maximumType = validValidationTypes[i + 1];
    const groupErrors = [];

    for (const type of [minimumType, maximumType]) {
      const validation = answer?.validation?.[type.id] || {};
      const errors = validation?.validationErrorInfo?.errors || [];
      const { enabled, inclusive } = validation;
      const value = enabled ? type.preview(validation, answer) : null;

      const handleSidebarButtonClick = () => {
        setModalIsOpen(true);
        setStartingTabId(type.id);
      };

      validationComponents.push(
        <SidebarValidation
          id={type.id}
          key={type.id}
          data-test={`sidebar-button-${kebabCase(type.title)}`}
          onClick={handleSidebarButtonClick}
          hasError={errors.length}
        >
          <Title>
            {titleText(type.id, type.title, validation.enabled, inclusive)}
          </Title>
          {enabled && value !== undefined && value !== null && (
            <Detail>{value}</Detail>
          )}
        </SidebarValidation>
      );

      if (errors.length) {
        const individualErrors = [];
        errors.forEach((error) => {
          const target = [
            "ERR_NO_VALUE",
            "ERR_REFERENCE_MOVED",
            "ERR_REFERENCE_DELETED",
            "ERR_OFFSET_NO_VALUE",
          ].includes(error.errorCode)
            ? individualErrors
            : groupErrors;
          target.push(error);
        });

        if (individualErrors.length) {
          validationComponents.push(renderError(individualErrors[0]));
        }
      }
    }

    if (groupErrors.length) {
      validationComponents.push(renderError(groupErrors[0]));
    }
  }

  return (
    <ValidationContext.Provider value={{ answer }}>
      {validationComponents}
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
