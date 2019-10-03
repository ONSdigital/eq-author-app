import React from "react";
import { kebabCase, get, startCase, isNull } from "lodash";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import gql from "graphql-tag";

import { colors } from "constants/theme";
import ModalWithNav from "components/modals/ModalWithNav";
import { unitConversion } from "constants/unit-types";
import SidebarButton, { Title, Detail } from "components/buttons/SidebarButton";
import IconText from "components/IconText";
import WarningIcon from "constants/icon-warning.svg?inline";
import withValidations from "enhancers/withValidations";
import ValidationErrorInfo from "graphql/fragments/validationErrorInfo.graphql";

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
    title: "Earliest Date",
    render: () => (
      <EarliestDate>{props => <DateValidation {...props} />}</EarliestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "latestDate",
    title: "Latest Date",
    render: () => (
      <LatestDate>{props => <DateValidation {...props} />}</LatestDate>
    ),
    types: [DATE, DATE_RANGE],
    preview: DatePreview,
  },
  {
    id: "minDuration",
    title: "Min Duration",
    render: () => (
      <MinDuration>{props => <DurationValidation {...props} />}</MinDuration>
    ),
    types: [DATE_RANGE],
    preview: DurationPreview,
  },
  {
    id: "maxDuration",
    title: "Max Duration",
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

export class UnwrappedAnswerValidation extends React.PureComponent {
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
    <SidebarButton
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
    </SidebarButton>
  );

  render() {
    const { answer } = this.props;
    const validValidationTypes = validations[answer.type] || [];
    if (validValidationTypes.length === 0) {
      return null;
    }

    const validationErrors = [];

    return (
      <ValidationContext.Provider value={{ answer }}>
        {validValidationTypes.map(validationType => {
          const validation = get(answer, `validation.${validationType.id}`, {});
          const errors = get(validation, `validationErrorInfo.errors`, []);
          validationErrors.push(...errors);
          const { enabled, previousAnswer, metadata, inclusive } = validation;
          const value = enabled
            ? validationType.preview(validation, answer)
            : "";

          return this.renderButton({
            ...validationType,
            value,
            enabled,
            previousAnswer,
            metadata,
            hasError: errors.length > 0,
            inclusive,
          });
        })}

        {validationErrors.length > 0 && (
          <PropertiesError icon={WarningIcon}>
            Enter a max value that is greater than min value
          </PropertiesError>
        )}
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

UnwrappedAnswerValidation.propTypes = {
  answer: CustomPropTypes.answer,
};

export const VALIDATION_QUERY = gql`
  subscription Validation($id: ID!) {
    validationUpdated(id: $id) {
      id
      totalErrorCount
      sections {
        pages {
          ... on QuestionPage {
            id
            validationErrorInfo {
              id
              totalCount
            }
            answers {
              ... on BasicAnswer {
                id
                validation {
                  ... on NumberValidation {
                    minValue {
                      id
                      validationErrorInfo {
                        ...ValidationErrorInfo
                      }
                    }
                    maxValue {
                      id
                      validationErrorInfo {
                        ...ValidationErrorInfo
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${ValidationErrorInfo}
`;

export default withValidations(UnwrappedAnswerValidation, VALIDATION_QUERY);
