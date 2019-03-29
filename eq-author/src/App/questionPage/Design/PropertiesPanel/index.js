import React from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import ScrollPane from "components/ScrollPane";
import { get, noop, filter, findIndex, flow, toUpper } from "lodash/fp";
import getIdForObject from "utils/getIdForObject";
import AnswerValidation from "App/questionPage/Design/Validation/AnswerValidation";
import { flowRight, isEmpty } from "lodash";

import withUpdateAnswer from "App/questionPage/Design/answers/withUpdateAnswer";
import AnswerProperties from "App/questionPage/Design/AnswerProperties";
import QuestionProperties from "App/questionPage/Design/QuestionProperties";
import Accordion from "components/Accordion";

const Properties = flowRight(withUpdateAnswer)(AnswerProperties);

const Padding = styled.div`
  padding: 0 0.5em;
`;

const AnswerPropertiesContainer = styled.div`
  padding: 0.5em;
`;

const PropertiesPane = styled.div`
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border-left: 2px solid #eee;
  font-size: 1em;
`;

const PropertiesPaneBody = styled.div`
  background: ${colors.white};
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const filterByType = type => filter({ type });
const findIndexById = ({ id }) => findIndex({ id });
const numberTitle = title => index =>
  index > 0 ? `${title} ${index + 1}` : title;

const getTitle = ({ answer, answer: { type } }) =>
  flow(
    filterByType(type),
    findIndexById(answer),
    numberTitle(type),
    toUpper
  );

class PropertiesPanel extends React.Component {
  static propTypes = {
    page: CustomPropTypes.page,
  };

  handleSubmit = noop;

  render() {
    const { page } = this.props;
    return (
      <PropertiesPane>
        <PropertiesPaneBody>
          <ScrollPane>
            {!isEmpty(page) && (
              <Accordion title="Optional fields">
                <Padding>
                  <QuestionProperties page={page} />
                </Padding>
              </Accordion>
            )}
            {get("answers.length", page) > 0 &&
              page.answers.map((answer, index) => (
                <Accordion
                  title={getTitle({ answer })(page.answers)}
                  key={getIdForObject(answer)}
                >
                  <AnswerPropertiesContainer>
                    <Properties
                      id={getIdForObject(answer)}
                      answer={{ ...answer, index }}
                      onSubmit={this.handleSubmit}
                    />
                    <AnswerValidation answer={answer} />
                  </AnswerPropertiesContainer>
                </Accordion>
              ))}
          </ScrollPane>
        </PropertiesPaneBody>
      </PropertiesPane>
    );
  }
}

export default PropertiesPanel;
