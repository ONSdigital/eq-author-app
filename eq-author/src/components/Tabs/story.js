import React from "react";
import { storiesOf } from "@storybook/react";
import Tabs from "components/Tabs";
import { MemoryRouter, Route } from "react-router";
import styled from "styled-components";

const questionnaire = {
  id: "1",
  title: "Questionnaire",
  sections: [
    {
      title: "Section 1",
      id: "0",
      pages: [
        {
          title: "Question 1.1",
          id: "2"
        }
      ]
    }
  ]
};

const Wrapper = styled.div`
  max-width: 50em;
  margin: auto;
`;

const Content = styled.div`
  padding: 1em 2em;
`;

storiesOf("Tabs", module)
  .addDecorator(story => (
    <Wrapper>
      <MemoryRouter
        initialEntries={["/questionnaire/1/design/0/2"]}
        initialIndex={0}
      >
        <Route
          path="/questionnaire/:questionnaireId/design/:sectionId/:pageId"
          exact={false}
          render={story}
        />
      </MemoryRouter>
    </Wrapper>
  ))
  .add("Default", () => (
    <Tabs
      questionnaire={{ questionnaire }}
      section={questionnaire.sections[0]}
      page={questionnaire.sections[0].pages[0]}
    >
      <Content>
        <p>
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          Sed posuere consectetur est at lobortis. Maecenas faucibus mollis
          interdum. Nullam id dolor id nibh ultricies vehicula ut id elit.
          Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
          vestibulum.
        </p>
        <p>
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
          Sed posuere consectetur est at lobortis. Maecenas faucibus mollis
          interdum. Nullam id dolor id nibh ultricies vehicula ut id elit.
          Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis
          vestibulum.
        </p>
      </Content>
    </Tabs>
  ));
