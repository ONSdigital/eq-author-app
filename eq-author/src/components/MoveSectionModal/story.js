import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import MoveSectionModal from ".";
import CustomPropTypes from "custom-prop-types";
import { ApolloProvider } from "react-apollo";
import { buildQuestionnaire } from "tests/utils/createMockQuestionnaire";

class MoveSectionStory extends React.Component {
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
          move section
        </button>
        <MoveSectionModal
          isOpen={this.state.isModalOpen}
          onClose={this.handleToggleModal}
          questionnaire={questionnaire}
          section={questionnaire.sections[0]}
          onMoveSection={action("moveSection")}
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

storiesOf("MoveSectionModal", module).add("Modal", () => (
  <ApolloProvider client={client}>
    <MoveSectionStory questionnaire={buildQuestionnaire()} />
  </ApolloProvider>
));
