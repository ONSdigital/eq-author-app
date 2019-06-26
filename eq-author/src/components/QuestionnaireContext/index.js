import React, { createContext } from "react";

const QuestionnaireContext = createContext({
  questionnaire: null,
});

export const withQuestionnaire = Component => props => (
  <QuestionnaireContext.Consumer>
    {({ questionnaire }) => (
      <Component {...props} questionnaire={questionnaire} />
    )}
  </QuestionnaireContext.Consumer>
);

export default QuestionnaireContext;
