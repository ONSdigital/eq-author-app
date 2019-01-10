import React from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import ScrollPane from "components/ScrollPane";

import AnswerValidation from "App/questionPage/Design/Validation/AnswerValidation";
import { flowRight } from "lodash";

import withUpdateAnswer from "App/questionPage/Design/answers/withUpdateAnswer";
import AnswerProperties from "App/questionPage/Design/AnswerProperties";

import {
  noop,
  filter,
  findIndex,
  flow,
  toUpper,
  first,
  map,
  groupBy,
  contains,
  get
} from "lodash/fp";
import getIdForObject from "utils/getIdForObject";

import TotalValidation from "App/questionPage/Design/Validation/TotalValidation";
import QuestionProperties from "App/questionPage/Design/QuestionProperties";
import Accordion from "./Accordion";
import { NUMBER, CURRENCY } from "constants/answer-types";

const Properties = flowRight(withUpdateAnswer)(AnswerProperties);

const AccordionTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1em;
  position: relative;
  color: #666666;
`;

const Answer = styled.div`
  &:not(:only-of-type) {
    border-bottom: 1px solid #e4e8eb;
    margin-bottom: 0.5em;
    padding-bottom: 0.5em;
  }
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
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const ValidationContainer = styled.div`
  padding: 0 0 0.5em;
`;

const Padding = styled.div`
  padding: 0 0.5em;
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
    page: CustomPropTypes.page
  };

  handleSubmit = noop;

  render() {
    const { page } = this.props;

    const groupedAnswers = page && groupBy(answer => answer.type, page.answers);

    const answerTypesWithTotals = [NUMBER, CURRENCY];

    return (
      <PropertiesPane>
        <PropertiesPaneBody>
          <ScrollPane>
            {page && (
              <Accordion title="Optional fields">
                <Padding>
                  <QuestionProperties
                    page={page}
                    onHelpClick={() => this.setState({ showModal: true })}
                  />
                </Padding>
              </Accordion>
            )}

            {page &&
              map((answerGroup, index) => {
                const firstAnswer = first(answerGroup);

                return (
                  <Accordion
                    title={`${firstAnswer.type} properties`}
                    key={getIdForObject(answerGroup)}
                  >
                    <Padding>
                      <div style={{ padding: "0.5em 0" }}>
                        <Properties
                          id={getIdForObject(firstAnswer)}
                          answer={firstAnswer}
                          onSubmit={this.handleSubmit}
                          required={false}
                        />
                      </div>
                    </Padding>
                    <ValidationContainer>
                      {map(
                        answer => (
                          <Answer key={getIdForObject(answer)}>
                            <Padding>
                              <AccordionTitle>
                                {answer.label || answer.type}
                              </AccordionTitle>
                              <Properties
                                id={getIdForObject(answer)}
                                answer={answer}
                                onSubmit={this.handleSubmit}
                                decimals={false}
                              />
                              <AnswerValidation
                                answer={answer}
                                key={answer.id}
                              />
                            </Padding>
                          </Answer>
                        ),
                        answerGroup
                      )}

                      {contains(firstAnswer.type, answerTypesWithTotals) && (
                        <Answer>
                          <Padding>
                            <TotalValidation
                              answers={answerGroup}
                              onSubmit={this.handleSubmit}
                            />
                          </Padding>
                        </Answer>
                      )}
                    </ValidationContainer>
                  </Accordion>
                );
              }, groupedAnswers)}
          </ScrollPane>
        </PropertiesPaneBody>
      </PropertiesPane>
    );
  }
}

export default PropertiesPanel;
