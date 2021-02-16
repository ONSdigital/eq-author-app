import React, { createContext, useContext } from "react";

const QuestionnaireContext = createContext({
  questionnaire: null,
});

export const withQuestionnaire = (Component) => (props) => (
  <QuestionnaireContext.Consumer>
    {({ questionnaire }) => (
      <Component {...props} questionnaire={questionnaire} />
    )}
  </QuestionnaireContext.Consumer>
);

export const useQuestionnaire = () => useContext(QuestionnaireContext);

export default QuestionnaireContext;
