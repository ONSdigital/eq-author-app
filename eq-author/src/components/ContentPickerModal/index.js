import React from "react";
import PropTypes from "prop-types";
import { propType } from "graphql-anywhere";
import styled from "styled-components";
import { compact, find, isEmpty } from "lodash";

import BaseTabs from "components/BaseTabs";
import Modal, { CloseButton } from "components/modals/Modal";
import {
  AnswerContentPicker,
  QuestionContentPicker,
  MetadataContentPicker,
  RoutingDestinationContentPicker,
} from "components/ContentPicker";

import { colors } from "constants/theme";
import {
  ANSWER,
  QUESTION,
  METADATA,
  DESTINATION,
} from "components/ContentPickerSelect/content-types";

import LogicalDestination from "graphql/fragments/logical-destination.graphql";
import QuestionPageDestination from "graphql/fragments/question-page-destination.graphql";
import SectionDestination from "graphql/fragments/section-destination.graphql";

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
  top: ${props => (props.hasTabs ? "0" : "2em")};
  bottom: 0;
  margin: auto;
  align-items: center;
`;

const NavigationHeader = styled.div`
  align-items: center;
  border-bottom: 1px solid #ccc;
  position: relative;
  width: 100%;
`;

export const TabButton = styled.button`
  text-transform: uppercase;
  border: 0;
  color: ${colors.darkGrey};
  cursor: pointer;
  font-size: 0.9em;
  font-weight: bold;
  letter-spacing: 0.05em;
  padding: 1.1em;
  position: relative;

  &[aria-selected="true"] {
    color: ${colors.blue};
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
  min-height: 0;
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
    selectedTab: this.getSelectedTab(),
  };

  static propTypes = {
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
    questionData: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
      })
    ),
    selectedObj: PropTypes.shape({
      section: PropTypes.shape({
        id: PropTypes.string,
        displayName: PropTypes.string,
      }),
      page: PropTypes.shape({
        id: PropTypes.string,
        displayName: PropTypes.string,
      }),
      logical: PropTypes.string,
    }),
    selectedId: PropTypes.string,
    destinationData: PropTypes.shape({
      logicalDestinations: PropTypes.arrayOf(propType(LogicalDestination)),
      questionPages: PropTypes.arrayOf(propType(QuestionPageDestination)),
      sections: PropTypes.arrayOf(propType(SectionDestination)),
    }),
    onSubmit: PropTypes.func,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    contentTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
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
      pipingType: "answers",
    });
  };

  handleMetadataSubmit = ({ id, displayName }) => {
    this.props.onSubmit({
      id,
      displayName,
      pipingType: "metadata",
    });
  };

  buttonRender = (props, tab) =>
    tab.showTabButton ? <TabButton {...props}>{tab.title}</TabButton> : null;

  answerTab = {
    id: "answers",
    title: "Answer",
    showTabButton: true,
    render: () => {
      if (!this.props.answerData || this.props.answerData.length === 0) {
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
            selectedId={this.props.selectedId}
          />
        </React.Fragment>
      );
    },
  };

  questionTab = {
    id: "question",
    title: "Question",
    showTabButton: true,
    render: () => {
      if (!this.props.questionData || this.props.questionData.length === 0) {
        return <ErrorText>There are no questions to pick from</ErrorText>;
      }
      return (
        <React.Fragment>
          <HeaderSegment>
            <Title>Select a previous question</Title>
          </HeaderSegment>
          <QuestionContentPicker
            data={this.props.questionData}
            onSubmit={this.props.onSubmit}
            onClose={this.props.onClose}
          />
        </React.Fragment>
      );
    },
  };

  metadataTab = {
    id: "metadata",
    title: "Metadata",
    showTabButton: true,
    render: () => {
      if (!this.props.metadataData || this.props.metadataData.length === 0) {
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
    },
  };

  destinationTab = {
    id: "destination",
    title: "Destination",
    showTabButton: false,
    render: () => {
      if (!this.props.destinationData || isEmpty(this.props.destinationData)) {
        return <ErrorText>There are no destinations to pick from</ErrorText>;
      }
      return (
        <React.Fragment>
          <HeaderSegment>
            <Title>Select a destination</Title>
          </HeaderSegment>
          <RoutingDestinationContentPicker
            data={this.props.destinationData}
            onSubmit={this.props.onSubmit}
            onClose={this.props.onClose}
            selectedObj={this.props.selectedObj}
          />
        </React.Fragment>
      );
    },
  };
  tabConfig = [
    this.props.contentTypes.indexOf(ANSWER) !== -1 ? this.answerTab : null,
    this.props.contentTypes.indexOf(QUESTION) !== -1 ? this.questionTab : null,
    this.props.contentTypes.indexOf(METADATA) !== -1 ? this.metadataTab : null,
    this.props.contentTypes.indexOf(DESTINATION) !== -1
      ? this.destinationTab
      : null,
  ];

  tabList = ({ children }) => (
    <NavigationHeader>
      <StyledCloseButton
        onClick={this.props.onClose}
        hasTabs={find(this.tabConfig, "showTabButton")}
      >
        &times;
      </StyledCloseButton>
      {children}
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
