import React, { createContext, useContext, useMemo } from "react";

const QuestionnaireContext = createContext({
  questionnaire: null,
});

const PageContext = createContext(null);

export const PageContextProvider = ({ value, children }) =>
  useMemo(
    () => <PageContext.Provider value={value}>{children}</PageContext.Provider>,
    [value, children]
  );

export const withQuestionnaire = (Component) => (props) => (
  <QuestionnaireContext.Consumer>
    {({ questionnaire }) => (
      <Component {...props} questionnaire={questionnaire} />
    )}
  </QuestionnaireContext.Consumer>
);

export const useQuestionnaire = () => useContext(QuestionnaireContext);

export const usePage = () => useContext(PageContext);

export default QuestionnaireContext;
