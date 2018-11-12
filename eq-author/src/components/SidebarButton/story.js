import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import styled from "styled-components";
import SidebarButton, { Detail, Title } from "./index";

const Wrapper = styled.div`
  padding: 1em;
  width: 20em;
`;

storiesOf("SidebarButton", module)
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add("Empty", () => (
    <SidebarButton onClick={action("click")}>
      <Title>Min value</Title>
    </SidebarButton>
  ))
  .add("Number", () => (
    <SidebarButton onClick={action("click")}>
      <Title>Min value</Title>
      <Detail>0</Detail>
    </SidebarButton>
  ))
  .add("Date", () => (
    <React.Fragment>
      <SidebarButton onClick={action("earliest date click")}>
        <Title>Earliest date</Title>
        <Detail>120 days before:</Detail>
        <Detail>Title of previous question</Detail>
      </SidebarButton>
      <SidebarButton onClick={action("latest date click")}>
        <Title>Latest date</Title>
        <Detail>20 days after:</Detail>
        <Detail>Title of another previous question</Detail>
      </SidebarButton>
      <SidebarButton onClick={action("min duration click")}>
        <Title>Min duration</Title>
        <Detail>10 days</Detail>
      </SidebarButton>
      <SidebarButton onClick={action("max duration click")}>
        <Title>Max duration</Title>
        <Detail>50 days</Detail>
      </SidebarButton>
      <SidebarButton onClick={action("earliest date click")}>
        <Title>Earliest date</Title>
        <Detail>19 days before:</Detail>
        <Detail>(Completion date)</Detail>
      </SidebarButton>
      <SidebarButton onClick={action("latest date click")}>
        <Title>Latest date</Title>
        <Detail>20 days before:</Detail>
        <Detail>01/01/2019</Detail>
      </SidebarButton>
    </React.Fragment>
  ));
