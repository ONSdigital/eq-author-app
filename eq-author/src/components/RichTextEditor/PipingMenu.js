import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { isEmpty } from "lodash";

import ContentPicker from "components/ContentPickerv2";
import AvailablePipingContentQuery from "components/RichTextEditor/AvailablePipingContentQuery";
import shapeTree from "components/ContentPicker/shapeTree";

import CustomPropTypes from "custom-prop-types";

import IconPiping from "components/RichTextEditor/icon-piping.svg?inline";
import IconPipingMetadata from "components/RichTextEditor/icon-piping-metadata.svg?inline";
import IconPipingVariable from "components/RichTextEditor/icon-piping-variable.svg?inline";
import ToolbarButton from "components/RichTextEditor/ToolbarButton";

import {
  ANSWER,
  METADATA,
  VARIABLES,
} from "components/ContentPickerSelect/content-types";

export const MenuButton = styled(ToolbarButton)`
  height: 100%;
  &:disabled {
    cursor: default;
    opacity: 0.2;
  }
`;

export class Menu extends React.Component {
  static propTypes = {
    onItemChosen: PropTypes.func.isRequired,
    match: CustomPropTypes.match.isRequired,
    disabled: PropTypes.bool,
    canFocus: PropTypes.bool,
    loading: PropTypes.bool,
    allowableTypes: PropTypes.arrayOf(PropTypes.string),
    answerData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
    metadataData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
  };

  static defaultProps = {
    allowableTypes: [ANSWER, METADATA],
  };

  state = {
    pickerContent: "",
  };

  handleButtonClick = pickerContent => {
    this.setState({ pickerContent });
  };

  handlePickerClose = () => {
    this.setState({
      pickerContent: "",
    });
  };

  handlePickerSubmit = (...args) => {
    this.handlePickerClose();
    this.props.onItemChosen(...args);
  };

  render() {
    const {
      answerData,
      metadataData,
      disabled,
      loading,
      canFocus,
      allowableTypes,
    } = this.props;

    const { pickerContent } = this.state;

    const data = pickerContent === METADATA ? metadataData : answerData;

    return (
      <React.Fragment>
        {allowableTypes.includes(ANSWER) && (
          <MenuButton
            title="Pipe value"
            disabled={loading || disabled || isEmpty(answerData)}
            onClick={() => this.handleButtonClick(ANSWER)}
            canFocus={canFocus}
            data-test="piping-button"
          >
            <IconPiping />
          </MenuButton>
        )}
        {allowableTypes.includes(METADATA) && (
          <MenuButton
            title="Pipe metadata"
            disabled={loading || disabled || isEmpty(metadataData)}
            onClick={() => this.handleButtonClick(METADATA)}
            canFocus={canFocus}
            data-test="piping-button-metadata"
          >
            <IconPipingMetadata />
          </MenuButton>
        )}
        {allowableTypes.includes(VARIABLES) && (
          <MenuButton
            title="Pipe variable"
            disabled={loading || disabled}
            onClick={() => this.handleButtonClick(VARIABLES)}
            canFocus={canFocus}
            data-test="piping-button-variable"
          >
            <IconPipingVariable />
          </MenuButton>
        )}
        <ContentPicker
          isOpen={Boolean(this.state.pickerContent)}
          data={data}
          startingSelectedAnswers={[]}
          onClose={this.handlePickerClose}
          onSubmit={this.handlePickerSubmit}
          data-test="picker"
          singleItemSelect
          contentType={pickerContent}
        />
      </React.Fragment>
    );
  }
}

const calculateEntityName = ({
  sectionId,
  pageId,
  confirmationId,
  introductionId,
}) => {
  if (confirmationId) {
    return "questionConfirmation";
  }
  if (pageId) {
    return "page";
  }
  if (sectionId) {
    return "section";
  }
  if (introductionId) {
    return "questionnaireIntroduction";
  }
};

const postProcessPipingContent = entity => {
  if (!entity) {
    return false;
  }

  const processedAnswers = [];

  entity.availablePipingAnswers.forEach(answer => {
    if (answer.type === "DateRange") {
      processedAnswers.push({
        ...answer,
        id: `${answer.id}from`,
      });

      processedAnswers.push({
        ...answer,
        id: `${answer.id}to`,
        displayName: answer.secondaryLabel || answer.secondaryLabelDefault,
      });
    } else {
      processedAnswers.push(answer);
    }
  });

  return {
    ...entity,
    availablePipingAnswers: processedAnswers,
  };
};

export const UnwrappedPipingMenu = ({
  canFocus,
  allowableTypes,
  match,
  ...otherProps
}) => {
  if (!canFocus) {
    return (
      <>
        {allowableTypes.includes(ANSWER) && (
          <MenuButton title="Pipe value" disabled data-test="piping-button">
            <IconPiping />
          </MenuButton>
        )}
        {allowableTypes.includes(METADATA) && (
          <MenuButton
            title="Pipe metadata"
            disabled
            data-test="piping-button-metadata"
          >
            <IconPipingMetadata />
          </MenuButton>
        )}
        {allowableTypes.includes(VARIABLES) && (
          <MenuButton
            title="Pipe variable"
            disabled
            data-test="piping-button-variable"
          >
            <IconPipingVariable />
          </MenuButton>
        )}
      </>
    );
  }

  return (
    <AvailablePipingContentQuery
      questionnaireId={match.params.questionnaireId}
      pageId={match.params.pageId}
      sectionId={match.params.sectionId}
      confirmationId={match.params.confirmationId}
      introductionId={match.params.introductionId}
    >
      {({ data = {}, ...innerProps }) => {
        const entityName = calculateEntityName(match.params);
        const entity = postProcessPipingContent(data[entityName]) || {};

        return (
          <Menu
            answerData={shapeTree(entity.availablePipingAnswers)}
            metadataData={entity.availablePipingMetadata}
            entity={entity}
            entityName={entityName}
            allowableTypes={allowableTypes}
            canFocus={canFocus}
            match={match}
            {...otherProps}
            {...innerProps}
          />
        );
      }}
    </AvailablePipingContentQuery>
  );
};

UnwrappedPipingMenu.propTypes = {
  match: CustomPropTypes.match.isRequired,
  canFocus: PropTypes.bool,
  allowableTypes: PropTypes.arrayOf(PropTypes.string),
};

UnwrappedPipingMenu.defaultProps = {
  allowableTypes: [ANSWER, METADATA],
};

export default withRouter(UnwrappedPipingMenu);
