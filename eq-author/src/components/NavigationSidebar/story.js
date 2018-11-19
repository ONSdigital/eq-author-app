import React from "react";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ApolloProvider } from "react-apollo";

import { MemoryRouter, Route } from "react-router";

import styled from "styled-components";

import { UnwrappedNavigationSidebar as NavigationSidebar } from "components/NavigationSidebar";

const Wrapper = styled.div`
  width: 20em;
`;

const section1 = {
  displayName: "Section 1",
  id: "1",
  pages: [
    {
      displayName: "Question 1.1",
      id: "2"
    },
    {
      displayName: "Question 1.2",
      id: "3"
    }
  ]
};

const section2 = {
  displayName: "Section 2",
  id: "4",
  pages: [
    {
      displayName: "Question 2.1",
      id: "5"
    },
    {
      displayName: "Question 2.2",
      id: "6"
    }
  ]
};

const questionnaire = {
  title: "Questionnaire title",
  id: "0",
  sections: [section1],
  metadata: []
};

const props = {
  questionnaire,
  section: section1,
  page: section1.pages[0],
  currentPageId: section1.pages[0].id,
  onAddPage: action("Add Page"),
  onAddSection: action("Add Section"),
  onUpdateQuestionnaire: action("onUpdateQuestionnaire"),
  loading: false,
  canAddQuestionConfirmation: false,
  onAddQuestionConfirmation: action("Add Question Confirmation")
};

const client = {
  query: () => ({ questionnaire })
};

storiesOf("NavigationSidebar", module)
  .addDecorator(story => (
    <ApolloProvider client={client}>
      <MemoryRouter
        initialEntries={["/questionnaire/0/design/1/2"]}
        initialIndex={0}
      >
        <Route
          path="/questionnaire/:questionnaireId/design/:sectionId/:pageId"
          exact={false}
          render={story}
        />
      </MemoryRouter>
    </ApolloProvider>
  ))
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add("Single section", () => {
    return <NavigationSidebar {...props} />;
  })
  .add("Multiple sections", () => {
    const { ...otherProps } = props;
    const questionnaireWithMultipleSection = {
      ...questionnaire,
      sections: [...questionnaire.sections, section2]
    };

    return (
      <NavigationSidebar
        {...otherProps}
        questionnaire={questionnaireWithMultipleSection}
      />
    );
  })
  .add("Can add a question confirmation", () => {
    return <NavigationSidebar {...props} canAddQuestionConfirmation />;
  });
