import React from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import ScrollPane from "components/ScrollPane";
import { get, noop, filter, findIndex, flow, toUpper } from "lodash/fp";
import getIdForObject from "utils/getIdForObject";
import AnswerValidation from "App/questionPage/Design/Validation/AnswerValidation";
import { flowRight } from "lodash";
import { Field, Label, Select } from "components/Forms";

import withUpdateAnswer from "App/questionPage/Design/answers/withUpdateAnswer";
import AnswerProperties from "App/questionPage/Design/AnswerProperties";

import gql from "graphql-tag";
import { withRouter } from "react-router-dom";
import { Query } from "react-apollo";

const Properties = flowRight(withUpdateAnswer)(AnswerProperties);

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

const PropertiesPanelTitle = styled.h2`
  font-size: 0.8em;
  letter-spacing: 0.05em;
  vertical-align: middle;
  color: ${colors.darkGrey};
  text-align: center;
  text-transform: uppercase;
`;

const PropertiesPaneBody = styled.div`
  background: ${colors.white};
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const IntroProperties = styled.div`
  padding: 1em;
  border-top: ${props =>
    props.hasBorder ? `8px solid ${colors.lighterGrey}` : "none"};
`;

const AnswerPropertiesContainer = styled.div`
  padding: 1em;
  border-top: ${props =>
    props.hasBorder ? `8px solid ${colors.lighterGrey}` : "none"};
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
    const { page, intro, changeField, data } = this.props;

    return (
      <PropertiesPane>
        <PropertiesPaneBody>
          <ScrollPane>
            {intro &&
              data.questionnaire.theme === "default" && (
                <IntroProperties key="intro-properties">
                  <PropertiesPanelTitle>Introduction Page</PropertiesPanelTitle>
                  <Field style={{ marginTop: "1em" }}>
                    <Label>Legal basis</Label>
                    <Select
                      id="intro-legal"
                      name="legal"
                      onChange={changeField}
                      value={intro.legal}
                    >
                      <option value="notice-1">Notice 1</option>
                      <option value="notice-2">Notice 2</option>
                      <option value="voluntary">Voluntary</option>
                    </Select>
                  </Field>
                </IntroProperties>
              )}
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
          </ScrollPane>
        </PropertiesPaneBody>
      </PropertiesPane>
    );
  }
}

const QUESTIONNAIRE_QUERY = gql`
  query GetQuestionnaire($id: ID!) {
    questionnaire(id: $id) {
      theme
    }
  }
`;

export default withRouter(props => (
  <Query
    query={QUESTIONNAIRE_QUERY}
    variables={{ id: props.match.params.questionnaireId }}
  >
    {innerProps => <PropertiesPanel {...innerProps} {...props} />}
  </Query>
));
