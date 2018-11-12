import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { buildSections } from "tests/utils/createMockQuestionnaire";
import PositionModal from ".";

class PositionModalStory extends React.Component {
  state = {
    isModalOpen: true
  };

  handleToggleModal = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  handleChange = ({ value }) => {
    this.setState({
      selectedPosition: value
    });
  };

  render() {
    const data = buildSections(5);

    return (
      <PositionModal
        options={data}
        isOpen={this.state.isModalOpen}
        onClose={this.handleToggleModal}
        onMove={action("onMove")}
        selected={data[0]}
      />
    );
  }
}

storiesOf("PositionModal", module).add("Modal", () => <PositionModalStory />);
