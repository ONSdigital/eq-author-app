import React from "react";
import PropTypes from "prop-types";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { reject } from "lodash";
import MultipleChoiceAnswer from "./index";
import { CHECKBOX, RADIO } from "constants/answer-types";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 1em;
  width: 80%;
`;

const options = [
  {
    id: "0",
    label: "",
    value: "",
    description: "",
    __typename: "Option"
  },
  {
    id: "1",
    label: "",
    value: "",
    description: "",
    __typename: "Option"
  }
];

class MultipleChoiceAnswerWrapper extends React.Component {
  static propTypes = {
    type: PropTypes.string
  };

  state = {
    answer: {
      id: "0",
      options,
      label: "test",
      description: "test"
    }
  };

  nextId = 1;

  handleAddOption = () => {
    const { answer } = this.state;
    const newOption = {
      ...options[0],
      id: (++this.nextId).toString(),
      __typename: "Option"
    };

    const newState = {
      answer: {
        ...answer,
        options: answer.options.concat(newOption)
      }
    };

    this.setState(newState);

    return Promise.resolve(newOption);
  };

  handleDeleteOption = id => {
    const { answer } = this.state;

    const newState = {
      answer: {
        ...answer,
        options: reject(answer.options, { id })
      }
    };

    this.setState(newState);
  };

  render() {
    return (
      <Wrapper>
        <MultipleChoiceAnswer
          type={this.props.type}
          answer={this.state.answer}
          onUpdateOption={action("update option")}
          onUpdate={action("update")}
          onChange={action("change")}
          onAddOption={this.handleAddOption}
          onDeleteOption={this.handleDeleteOption}
          onAddOther={action("addOther")}
          onDeleteOther={action("deleteOther")}
          onAddExclusive={action("addExclusive")}
        />
      </Wrapper>
    );
  }
}

storiesOf("AnswerTypes/MultipleChoiceAnswer", module)
  .add(RADIO, () => <MultipleChoiceAnswerWrapper type={RADIO} />)
  .add(CHECKBOX, () => <MultipleChoiceAnswerWrapper type={CHECKBOX} />);
