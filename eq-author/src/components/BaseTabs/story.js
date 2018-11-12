import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";

import BaseTabs from "./";

const Padding = styled.div`
  padding: 2em;
`;

const ContentWrapper = styled.div`
  border: 1px solid red;
  padding: 2em;
`;

const TabList = styled.ul`
  list-style: none;
  margin: 0 0 1em;
  padding: 0;
`;

const TabItem = styled.li`
  margin: 0;
  padding: 0;
  display: inline;
`;

const tabs = [
  {
    id: 1,
    title: "Title 1",
    render: () => (
      <ContentWrapper>
        <h2>Content 1</h2>
      </ContentWrapper>
    )
  },
  {
    id: 2,
    title: "Title 2",
    render: () => (
      <ContentWrapper>
        <h2>Content 2</h2>
      </ContentWrapper>
    )
  }
];

storiesOf("BaseTabs", module)
  .addDecorator(story => <Padding>{story()}</Padding>)
  .add("Basic layout", () => (
    <BaseTabs
      onChange={action("change")}
      activeId={1}
      tabs={tabs}
      TabList={TabList}
      buttonRender={(props, item) => <TabItem {...props}>{item.title}</TabItem>}
    />
  ))
  .add("State management", () => {
    class BaseTabsStateManager extends React.Component {
      state = {
        id: 1
      };
      handleChange = id => {
        action("change")(id);
        this.setState({ id });
      };
      render() {
        return (
          <BaseTabs
            onChange={this.handleChange}
            activeId={this.state.id}
            tabs={tabs}
            TabList={TabList}
            buttonRender={(props, item) => (
              <TabItem {...props}>{item.title}</TabItem>
            )}
          />
        );
      }
    }
    return <BaseTabsStateManager />;
  });
