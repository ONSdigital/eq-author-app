import styled from "styled-components";
import { colors } from "constants/theme";

import Button from "components/buttons/Button";

import iconLink from "./icons/icon-link.svg";

export const Layout = styled.div`
  padding: 1.8em;
  &:focus-visible {
    border: 3px solid ${colors.focus};
    margin: 0;
    outline: none;
  }
`;

export const PageTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 0.5em;
`;

export const Description = styled.p`
  margin: 0.1em 0 1em;
  font-size: 14px;
  font-weight: 400;
  color: ${colors.textLight};
`;

export const Described = styled.span`
  font-size: 0.9rem;
  margin-bottom: 1em;
`;

export const Section = styled.div`
  padding-top: 1.5em;
  &:first-of-type {
    border-top: 1px solid #e0e0e0;
    border-bottom: 1px solid #e0e0e0;
  }
  &:last-of-type {
    padding-top: 0;
  }
`;

export const SectionTitle = styled.h3`
  font-size: 1.1em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

export const SearchContainer = styled.div`
  margin: 1em 0 2em;
  background: #ebeef0;
  height: 100%;
  padding: 1.5em;
  display: flex;
  justify-content: space-between;
  width: 60%;
`;

export const Separator = styled.span`
  border-left: 1px solid ${colors.blue};
  display: flex;
  align-items: center;
  margin-left: 0.9em;
  height: 22px;
`;

export const FlexContainer = styled.div`
  display: flex;
`;

export const PublicLabel = styled.span`
  padding: 0 0.5em;
  &:first-of-type {
    padding-left: 1em;
  }
  font-weight: bold;
  font-size: 12px;
  color: ${(props) => (props.isActive ? colors.black : colors.grey)};
`;

export const ShareLinkButton = styled(Button)`
  font-weight: bold;
  font-size: 0.8rem;
  line-height: 1.2;
  display: flex;
  align-items: center;
  padding: 0.6em;
  margin-bottom: 1.4em;
  border-radius: 0;
  color: ${colors.blue};
  background-color: ${colors.lighterGrey};

  &::before {
    content: "";
    background: url(${iconLink}) no-repeat center;
    display: inline-block;
    width: 1.3rem;
    height: 0.7rem;
    margin-right: 0.9em;
  }

  &:hover {
    background: ${colors.darkGrey};
    color: ${colors.white};
  }
`;

export const EditorTitle = styled(SectionTitle)`
  margin: 0;
`;

// These Share.. constants are a temporary fix for the Share page design.
export const SharePageTitle = styled.h2`
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 0.5em;
`;

export const ShareSectionTitle = styled.h3`
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;

export const ShareEditorTitle = styled.h4`
  font-weight: bold;
  color: ${colors.text};
  margin: 0;
`;
