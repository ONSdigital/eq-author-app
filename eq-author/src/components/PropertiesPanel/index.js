import React from "react";
import CustomPropTypes from "custom-prop-types";
import styled from "styled-components";
import { colors } from "constants/theme";
import ScrollPane from "components/ScrollPane";
import { noop, filter, findIndex, flow, toUpper, get } from "lodash/fp";

import { merge, map } from "lodash";

import getIdForObject from "utils/getIdForObject";
import AnswerPropertiesContainer from "containers/AnswerPropertiesContainer";
import AnswerValidation from "components/Validation/AnswerValidation";

import { connect } from "react-redux";
import {
  changeMeasurementType,
  changeDurationType
} from "redux/answer/actions";

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
  text-transform: uppercase;
  letter-spacing: 0.05em;
  vertical-align: middle;
  color: ${colors.darkGrey};
  text-align: center;
`;

const PropertiesPaneBody = styled.div`
  background: ${colors.white};
  display: flex;
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const AnswerProperties = styled.div`
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

class UnwrappedPropertiesPanel extends React.Component {
  static propTypes = {
    page: CustomPropTypes.page
  };

  handleSubmit = noop;

  render() {
    const { page } = this.props;

    return (
      <PropertiesPane>
        <PropertiesPaneBody>
          <ScrollPane>
            {page &&
              page.answers.length > 0 && (
                <div>
                  {page.answers.map((answer, index) => {
                    return (
                      <AnswerProperties
                        key={getIdForObject(answer)}
                        data-test={`properties-${index}`}
                        hasBorder={index > 0}
                      >
                        <PropertiesPanelTitle
                          data-test={`properties-title-${index}`}
                        >
                          {get("properties.unitType", answer) ||
                            getTitle({ answer })(page.answers)}
                        </PropertiesPanelTitle>
                        <AnswerPropertiesContainer
                          id={getIdForObject(answer)}
                          answer={{ ...answer, index }}
                          onSubmit={this.handleSubmit}
                          changeMeasurementType={
                            this.props.changeMeasurementType
                          }
                          changeDurationType={this.props.changeDurationType}
                        />
                        <AnswerValidation answer={answer} />
                      </AnswerProperties>
                    );
                  })}
                </div>
              )}
          </ScrollPane>
        </PropertiesPaneBody>
      </PropertiesPane>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { page } = ownProps;

  if (page === undefined) {
    return { page };
  }

  return {
    page: merge({}, page, {
      answers: map(page.answers, answer => ({
        properties: state.answer[answer.id]
      }))
    })
  };
};

const PropertiesPanel = connect(
  mapStateToProps,
  { changeMeasurementType, changeDurationType }
)(UnwrappedPropertiesPanel);

export default PropertiesPanel;
