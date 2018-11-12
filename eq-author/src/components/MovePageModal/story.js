import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import MovePageModal from ".";
import CustomPropTypes from "custom-prop-types";
import { ApolloProvider } from "react-apollo";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

class MovePageStory extends React.Component {
  static propTypes = {
    questionnaire: CustomPropTypes.questionnaire
  };
  state = {
    isModalOpen: true
  };

  handleToggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    const { questionnaire } = this.props;

    return (
      <div>
        <button type="button" onClick={this.handleToggleModal}>
          move page
        </button>
        <MovePageModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleToggleModal}
          questionnaire={questionnaire}
          sectionId={questionnaire.sections[0].id}
          page={questionnaire.sections[0].pages[0]}
          onMovePage={action("movePage")}
        />
      </div>
    );
  }
}

const questionnaire = buildQuestionnaire(10);
const client = {
  query: () => ({
    questionnaire
  })
};

storiesOf("MovePageModal", module).add("Modal", () => (
  <ApolloProvider client={client}>
    <MovePageStory questionnaire={buildQuestionnaire()} />
  </ApolloProvider>
));
