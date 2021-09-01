import React, { useState, useMemo, useCallback } from "react";
import { kebabCase, get, startCase } from "lodash";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import MultiLineField from "components/AnswerContent/Format/MultiLineField";
import ModalWithNav from "components/modals/ModalWithNav";
import { unitConversion } from "constants/unit-types";
import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";

import ValidationContext from "./ValidationContext";
import DurationValidation from "./DurationValidation";
import DateValidation from "./DateValidation";

import NumericValidation from "./NumericValidation/index";

import { Field } from "components/Forms";

import DatePreview from "./DatePreview";
import DurationPreview from "./DurationPreview";
import {
  MIN_INCLUSIVE_TEXT,
  MAX_INCLUSIVE_TEXT,
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

const ValidationGroupTop = styled.div`
  display: flex;
  align-self: flex-start;
  button {
    width: 15em;
    margin-right: 1em;
  }
`;

const ValidationGroupBottom = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 1em;
  align-self: flex-start;

  button {
    width: 15em;
    margin-right: 1em;
  }
`;

const InlineField = styled(Field)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
`;

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

  const validationComponentsMinValue = [];
  const validationComponentsMaxValue = [];

  const validationComponentsEarliestDate = [];
  const validationComponentsLatestDate = [];

  const validationComponentsMinDuration = [];
  const validationComponentsMaxDuration = [];

  for (let i = 0; i < validValidationTypes.length; i += 2) {
    const minimumType = validValidationTypes[i];
    const maximumType = validValidationTypes[i + 1];
    const groupErrors = [];

    for (const type of [minimumType, maximumType]) {
      const validation = answer?.validation?.[type.id] || { __typename: "" };
      const errors = validation?.validationErrorInfo?.errors || [];
      const { enabled, inclusive } = validation;
      const value = enabled ? type.preview(validation, answer) : null;

      const handleSidebarButtonClick = () => {
        setModalIsOpen(true);
        setStartingTabId(type.id);
      };

      if (validation.__typename.includes("MinValue")) {
        validationComponentsMaxValue.push(
          <SidebarButton
            id={type.id}
            key={type.id}
            data-test={`sidebar-button-${kebabCase(type.title)}`}
            onClick={handleSidebarButtonClick}
            errors={[...errors, ...groupErrors]}
          >
            <Title>
              {titleText(type.id, type.title, validation.enabled, inclusive)}
            </Title>
            {enabled && value !== undefined && value !== null && (
              <Detail>{value}</Detail>
            )}
          </SidebarButton>
        );
      }

      if (validation.__typename.includes("MaxValue")) {
        validationComponentsMaxValue.push(
          <SidebarButton
            id={type.id}
            key={type.id}
            data-test={`sidebar-button-${kebabCase(type.title)}`}
            onClick={handleSidebarButtonClick}
            errors={[...errors, ...groupErrors]}
          >
            <Title>
              {titleText(type.id, type.title, validation.enabled, inclusive)}
            </Title>
            {enabled && value !== undefined && value !== null && (
              <Detail>{value}</Detail>
            )}
          </SidebarButton>
        );
      }

      if (validation.__typename.includes("EarliestDate")) {
        validationComponentsEarliestDate.push(
          <SidebarButton
            id={type.id}
            key={type.id}
            data-test={`sidebar-button-${kebabCase(type.title)}`}
            onClick={handleSidebarButtonClick}
            errors={[...errors, ...groupErrors]}
          >
            <Title>
              {titleText(type.id, type.title, validation.enabled, inclusive)}
            </Title>
            {enabled && value !== undefined && value !== null && (
              <Detail>{value}</Detail>
            )}
          </SidebarButton>
        );
      }
      if (validation.__typename.includes("LatestDate")) {
        validationComponentsLatestDate.push(
          <SidebarButton
            id={type.id}
            key={type.id}
            data-test={`sidebar-button-${kebabCase(type.title)}`}
            onClick={handleSidebarButtonClick}
            errors={[...errors, ...groupErrors]}
          >
            <Title>
              {titleText(type.id, type.title, validation.enabled, inclusive)}
            </Title>
            {enabled && value !== undefined && value !== null && (
              <Detail>{value}</Detail>
            )}
          </SidebarButton>
        );
      }

      if (validation.__typename.includes("MinDuration")) {
        validationComponentsMinDuration.push(
          <SidebarButton
            id={type.id}
            key={type.id}
            data-test={`sidebar-button-${kebabCase(type.title)}`}
            onClick={handleSidebarButtonClick}
            errors={[...errors, ...groupErrors]}
          >
            <Title>
              {titleText(type.id, type.title, validation.enabled, inclusive)}
            </Title>
            {enabled && value !== undefined && value !== null && (
              <Detail>{value}</Detail>
            )}
          </SidebarButton>
        );
      }
      if (validation.__typename.includes("MaxDuration")) {
        validationComponentsMaxDuration.push(
          <SidebarButton
            id={type.id}
            key={type.id}
            data-test={`sidebar-button-${kebabCase(type.title)}`}
            onClick={handleSidebarButtonClick}
            errors={[...errors, ...groupErrors]}
          >
            <Title>
              {titleText(type.id, type.title, validation.enabled, inclusive)}
            </Title>
            {enabled && value !== undefined && value !== null && (
              <Detail>{value}</Detail>
            )}
          </SidebarButton>
        );
      }
    }
  }

  return (
    <MultiLineField id="validation-setting" label="Validation settings">
      <ValidationContext.Provider value={{ answer }}>
        {(validationComponentsMinValue.length > 0 ||
          validationComponentsMaxValue.length > 0) && (
          <InlineField>
            <ValidationGroupTop>
              {validationComponentsMinValue}
            </ValidationGroupTop>
            <ValidationGroupTop>
              {validationComponentsMaxValue}
            </ValidationGroupTop>
          </InlineField>
        )}
        {(validationComponentsEarliestDate.length > 0 ||
          validationComponentsLatestDate.length > 0) && (
          <InlineField>
            <ValidationGroupTop>
              {validationComponentsEarliestDate}
            </ValidationGroupTop>
            <ValidationGroupTop>
              {validationComponentsLatestDate}
            </ValidationGroupTop>
          </InlineField>
        )}
        {(validationComponentsMinDuration.length > 0 ||
          validationComponentsMaxDuration.length > 0) && (
          <InlineField>
            <ValidationGroupBottom>
              {validationComponentsMinDuration}
            </ValidationGroupBottom>
            <ValidationGroupBottom>
              {validationComponentsMaxDuration}
            </ValidationGroupBottom>
          </InlineField>
        )}
        <ModalWithNav
          id={modalId}
          onClose={handleModalClose}
          navItems={validValidationTypes}
          title={`${startCase(answer.type)} validation`}
          isOpen={modalIsOpen}
          startingTabId={startingTabId}
        />
      </ValidationContext.Provider>
    </MultiLineField>
  );
};

AnswerValidation.propTypes = {
  answer: CustomPropTypes.answer,
};

export default React.memo(AnswerValidation);
