import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { compact, isArray } from "lodash";

import BaseTabs from "components/BaseTabs";
import Modal, { CloseButton } from "components/Modal";
import {
  AnswerContentPicker,
  MetadataContentPicker
} from "components/ContentPicker";

import { colors } from "constants/theme";

const HeaderSegment = styled.div`
  margin: 0;
`;

const Title = styled.h1`
  color: ${colors.darkGrey};
  font-weight: bold;
  font-size: 1.3em;
  margin: 1em 0;
`;

export const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  right: 0.5em;
  top: 0;
  bottom: 0;
  margin: auto;
  align-items: center;
`;

const NavigationHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid #ccc;
  display: flex;
  position: relative;
  width: 100%;
`;

export const TabButton = styled.button`
  text-transform: uppercase;
  border: 0;
  color: ${colors.blue};
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  letter-spacing: 0.05em;
  padding: 1.1em;
  position: relative;

  &[aria-selected="true"] {
    color: ${colors.darkGrey};
    border-bottom: 2px solid ${colors.primary};
    margin-bottom: -2px;
  }

  &:focus {
    outline: 3px solid ${colors.orange};
    outline-offset: -3px;
    z-index: 2;
  }

  &:hover {
    background: ${colors.lighterGrey};
  }
`;

const StyledModal = styled(Modal)`
  .Modal {
    padding: 0;
    width: 45em;
    height: 30em;
  }
`;

const ContentWrapper = styled.div`
  margin: 0 1em;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  justify-content: center;
`;

const ErrorText = styled.span`
  align-items: center;
  color: ${colors.darkGrey};
  display: flex;
  font-size: 1.2em;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

class ContentPickerModal extends React.Component {
  state = {
    selectedTab: this.getSelectedTab()
  };

  static propTypes = {
    answerData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ),
    metadataData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired
      })
    ),
    onSubmit: PropTypes.func,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  };

  getSelectedTab() {
    const { answerData = [] } = this.props;
    return answerData.length > 0 ? "answers" : "metadata";
  }

  handleTabChange = selectedTab => {
    this.setState({ selectedTab });
  };

  handleAnswerSubmit = ({ id, displayName, type }) => {
    this.props.onSubmit({
      id,
      displayName,
      type,
      pipingType: "answers"
    });
  };

  handleMetadataSubmit = ({ id, displayName }) => {
    this.props.onSubmit({
      id,
      displayName,
      pipingType: "metadata"
    });
  };

  buttonRender = (props, tab) => <TabButton {...props}>{tab.title}</TabButton>;

  answerTab = {
    id: "answers",
    title: "Answer",
    render: () => {
      if (this.props.answerData.length === 0) {
        return (
          <ErrorText>There are no previous answers to pick from</ErrorText>
        );
      }
      return (
        <React.Fragment>
          <HeaderSegment>
            <Title>Select a previous answer</Title>
          </HeaderSegment>
          <AnswerContentPicker
            data={this.props.answerData}
            onSubmit={this.handleAnswerSubmit}
            onClose={this.props.onClose}
          />
        </React.Fragment>
      );
    }
  };

  metadataTab = {
    id: "metadata",
    title: "Metadata",
    render: () => {
      if (this.props.metadataData.length === 0) {
        return (
          <ErrorText>There is no configured metadata to pick from</ErrorText>
        );
      }
      return (
        <React.Fragment>
          <HeaderSegment>
            <Title>Select metadata</Title>
          </HeaderSegment>
          <MetadataContentPicker
            data={this.props.metadataData}
            onSubmit={this.handleMetadataSubmit}
            onClose={this.props.onClose}
          />
        </React.Fragment>
      );
    }
  };

  tabConfig = [
    isArray(this.props.answerData) ? this.answerTab : null,
    isArray(this.props.metadataData) ? this.metadataTab : null
  ];

  tabList = ({ children }) => (
    <NavigationHeader>
      {children}
      <StyledCloseButton onClick={this.props.onClose}>
        &times;
      </StyledCloseButton>
    </NavigationHeader>
  );

  render() {
    return (
      <StyledModal isOpen={this.props.isOpen} hasCloseButton={false}>
        <Flex>
          <BaseTabs
            activeId={this.state.selectedTab}
            onChange={this.handleTabChange}
            TabList={this.tabList}
            buttonRender={this.buttonRender}
            tabs={compact(this.tabConfig)}
            ContentWrapper={ContentWrapper}
          />
        </Flex>
      </StyledModal>
    );
  }
}

export default ContentPickerModal;
