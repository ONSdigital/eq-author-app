import React from "react";
import { storiesOf } from "@storybook/react";
import RichTextEditor from "components/RichTextEditor";
import styled from "styled-components";
import { action } from "@storybook/addon-actions";
import { ApolloProvider } from "react-apollo";
import { withKnobs, boolean } from "@storybook/addon-knobs";
import { MemoryRouter, Route } from "react-router";
import { noop } from "lodash";

const content = `
<h2>List of styles:</h2>
<ul>
  <li>Regular</li>
  <li><strong>Bold</strong></li>
  <li><em>Emphasis</em></li>
</ul>
`;

const Wrapper = styled.div`
  margin: 4em 1em 0;
  max-width: 30em;
`;

const RTE = styled.div`
  padding: 1em;
  border-radius: 2px;
  border: 1px solid #f4ecec;
  min-height: 3em;
  font-size: 0.9em;
`;

const Title = styled.div`
  font-size: 1.6em;
  font-weight: 700;
`;

const questionnaire = {
  sections: [
    {
      id: "1",
      title: "",
      pages: [
        {
          id: "1",
          title: "",
          answers: [{ id: "1", label: "", type: "Currency" }]
        }
      ]
    }
  ]
};

const client = {
  query: () => ({ questionnaire }),
  watchQuery: () => ({
    refetch: noop,
    fetchMore: noop,
    updateQuery: noop,
    startPolling: noop,
    stopPolling: noop,
    subscribeToMore: noop,
    currentResult: () => questionnaire,
    getLastResult: () => questionnaire,
    resetLastResults: noop,
    getLastErrro: noop,
    setOptions: () => Promise.resolve()
  })
};

const props = {
  onUpdate: action("onUpdate"),
  label: "Enter some text",
  placeholder: "Enter some text...",
  id: "richtext",
  sectionId: "1",
  client
};

storiesOf("RichTextEditor", module)
  .addDecorator(withKnobs)
  .addDecorator(story => {
    const renderStory = () => <RTE>{story()}</RTE>;

    return (
      <Wrapper>
        <ApolloProvider client={props.client}>
          <MemoryRouter
            initialEntries={[
              {
                pathname: "/questionnaire/1/design/1/1"
              }
            ]}
            initialIndex={0}
          >
            <Route
              path="/questionnaire/:questionnaireId/design/:sectionId/:pageId"
              exact={false}
              render={renderStory}
            />
          </MemoryRouter>
        </ApolloProvider>
      </Wrapper>
    );
  })
  .add("Default", () => <RichTextEditor {...props} />)
  .add("Configurable controls", () => (
    <RichTextEditor
      {...props}
      controls={{
        heading: boolean("heading", true),
        bold: boolean("bold", true),
        emphasis: boolean("emphasis", true),
        list: boolean("list", true)
      }}
    />
  ))
  .add("With existing value", () => (
    <RichTextEditor value={content} {...props} />
  ))
  .add("Title field", () => (
    <Title>
      <RichTextEditor
        {...props}
        controls={{
          bold: false,
          list: false,
          heading: false,
          emphasis: true
        }}
      />
    </Title>
  ));
