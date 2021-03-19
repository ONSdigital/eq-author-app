import React from "react";

import styled from "styled-components";
import { colors } from "constants/theme";

import Button from "components/buttons/Button";

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;

const Body = styled.div`
  margin-bottom: 0.5em;
`;

const Footer = styled.div``;

const ColumnWrapper = styled.div``;

const Text = styled.p`
  border: 0.0625em solid ${colors.lightGrey};
  background-color: ${colors.lighterGrey};
  padding: 0.5em 1em;
  margin: 0;
  margin-bottom: 0.3125em;
`;

const Avatar = styled.p`
  width: 2.25em;
  height: 2.25em;
  line-height: 2.25em;
  border-radius: 50%;
  text-align: center;
  color: ${colors.white};
  background-color: ${colors.primary};
  margin: 0;
  margin-right: 0.5em;
`;

const Author = styled.p`
  margin: 0;
`;

const Date = styled.p`
  font-size: 0.8em;
  color: ${colors.grey};
  margin: 0;
`;

const Comment = ({ author, datePosted, text, dateModified }) => {
  return (
    <>
      <Header>
        <Avatar>JB</Avatar>
        <ColumnWrapper>
          <Author>{author}</Author>
          <Date>{datePosted}</Date>
        </ColumnWrapper>
      </Header>
      <Body>
        <Text>{text}</Text>
        <Date>{dateModified}</Date>
      </Body>
      <Footer>
        <Button variant="greyed" small-medium>
          Reply
        </Button>
      </Footer>
    </>
  );
};

export default Comment;
