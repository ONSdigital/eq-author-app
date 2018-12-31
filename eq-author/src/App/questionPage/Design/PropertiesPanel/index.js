import React from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import ScrollPane from "components/ScrollPane";

import AnswerValidation from "App/questionPage/Design/Validation/AnswerValidation";
import { flowRight } from "lodash";

import withUpdateAnswer from "App/questionPage/Design/answers/withUpdateAnswer";
import AnswerProperties from "App/questionPage/Design/AnswerProperties";

const Properties = flowRight(withUpdateAnswer)(AnswerProperties);
import {
  noop,
  filter,
  findIndex,
  flow,
  toUpper,
  first,
  map,
  groupBy,
  contains
} from "lodash/fp";
import getIdForObject from "utils/getIdForObject";

import TotalValidation from "components/Validation/TotalValidation";
import QuestionProperties from "components/QuestionProperties";
import Section, { Title } from "./Section";
import { NUMBER, CURRENCY } from "constants/answer-types";

const SectionTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1em;
  position: relative;
  color: #666666;
`;

const AnswerProperties = styled.div`
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
            {get("answers.length", page) > 0 && (
              <div>
                {page.answers.map((answer, index) => (
                  <AnswerPropertiesContainer
                    key={getIdForObject(answer)}
                    data-test={`properties-${index}`}
                    hasBorder={index > 0}
                  >
                    <PropertiesPanelTitle
                      data-test={`properties-title-${index}`}
                    >
                      {getTitle({ answer })(page.answers)}
                    </PropertiesPanelTitle>
                    <Properties
                      id={getIdForObject(answer)}
                      answer={{ ...answer, index }}
                      onSubmit={this.handleSubmit}
                    />
                    <AnswerValidation answer={answer} />
                  </AnswerPropertiesContainer>
                ))}
              </div>
            )}
            {page && (
              <Section title="Optional fields">
                <Padding>
                  <QuestionProperties
                    page={page}
                    onHelpClick={() => this.setState({ showModal: true })}
                  />
                </Padding>
              </Section>
            )}

            {page &&
              map(answerGroup => {
                const firstAnswer = first(answerGroup);
                return (
                  <Section
                    title={`${firstAnswer.type} properties`}
                    key={getIdForObject(firstAnswer)}
                  >
                    <Padding>
                      <div style={{ padding: "0.5em 0" }}>
                        <AnswerPropertiesContainer
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
                          <AnswerProperties>
                            <Padding>
                              <SectionTitle>
                                {answer.label || answer.type}
                              </SectionTitle>
                              <AnswerPropertiesContainer
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
                          </AnswerProperties>
                        ),
                        answerGroup
                      )}

                      {contains(firstAnswer.type, answerTypesWithTotals) && (
                        <Padding>
                          <TotalValidation
                            answers={answerGroup}
                            onSubmit={this.handleSubmit}
                          />
                        </Padding>
                      )}
                    </ValidationContainer>
                  </Section>
                );
              }, groupedAnswers)}
          </ScrollPane>
        </PropertiesPaneBody>
      </PropertiesPane>
    );
  }
}

export default PropertiesPanel;
