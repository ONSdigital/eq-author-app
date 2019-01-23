import React, { PureComponent } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { debounce, throttle, isEmpty } from "lodash";

import QuestionnairesTable from "./QuestionnairesTable";

import iconSearch from "./icon-search.svg";
import VisuallyHidden from "components/VisuallyHidden";
import { colors } from "constants/theme";
import { Input } from "components/Forms";
import Button from "components/buttons/Button";
import QuestionnaireSettingsModal from "App/QuestionnaireSettingsModal";

const Header = styled.div`
  padding: 1.5em 0;
  display: flex;
  z-index: 1;
`;

const Buttons = styled.div`
  margin-left: auto;
`;

const NoResults = styled.div`
  padding: 1em;
  font-weight: bold;
`;

const Panel = styled.div`
  background: white;
  border-radius: 4px;
  border: 1px solid ${colors.bordersLight};
`;

const Search = styled.div`
  position: relative;
  &::before {
    content: url(${iconSearch});
    display: inline-block;
    position: absolute;
    left: 0.5em;
    top: 0;
    bottom: 0;
    height: 2em;
    margin: auto;
  }
`;

const SearchInput = styled(Input).attrs({
  type: "search",
  placeholder: "Search",
})`
  width: 20em;
  padding: 0.6em;
  line-height: 1;
  padding-left: 2.5em;
  border-radius: 4px;
  border-color: ${colors.bordersLight};

  &:hover {
    outline: none;
  }
`;

class QuestionnairesView extends PureComponent {
  state = {
    isModalOpen: false,
  };

  debouncedSetState = debounce(this.setState, 1000);

  throttledSetState = throttle(this.setState, 500);

  handleModalOpen = () => this.setState({ isModalOpen: true });

  handleModalClose = () => this.setState({ isModalOpen: false });

  handleSearchChange = ({ value }) => {
    const input = {
      search: value.toLowerCase(),
    };

    if (value.length < 5) {
      this.throttledSetState(input);
    } else {
      this.debouncedSetState(input);
    }

    // this.setState(input);
  };

  render() {
    let filteredQuestionnaires;

    const {
      questionnaires,
      onDeleteQuestionnaire,
      onDuplicateQuestionnaire,
      onCreateQuestionnaire,
    } = this.props;

    const { search } = this.state;

    const isFiltered = !isEmpty(search);

    filteredQuestionnaires = isFiltered
      ? questionnaires.filter(q => q.title.toLowerCase().includes(search))
      : questionnaires;

    return (
      <div>
        <Header>
          <Search>
            <VisuallyHidden>
              <label htmlFor="search">Search</label>
            </VisuallyHidden>
            <SearchInput id="search" onChange={this.handleSearchChange} />
          </Search>
          <Buttons>
            <Button
              onClick={this.handleModalOpen}
              primary
              data-test="create-questionnaire"
            >
              Create
            </Button>
            <QuestionnaireSettingsModal
              isOpen={this.state.isModalOpen}
              onClose={this.handleModalClose}
              onSubmit={onCreateQuestionnaire}
              confirmText="Create"
            />
          </Buttons>
        </Header>
        <Panel>
          {isEmpty(filteredQuestionnaires) ? (
            <NoResults>No questionnaires found</NoResults>
          ) : (
            <QuestionnairesTable
              questionnaires={filteredQuestionnaires}
              onDeleteQuestionnaire={onDeleteQuestionnaire}
              onDuplicateQuestionnaire={onDuplicateQuestionnaire}
            />
          )}
        </Panel>
      </div>
    );
  }
}

export default QuestionnairesView;
