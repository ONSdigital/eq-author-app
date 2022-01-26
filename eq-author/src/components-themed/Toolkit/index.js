import styled from "styled-components";
import Input from "components-themed/Input";
import { Field } from "components/Forms";
import { colors } from "constants/theme";

export const PageTitle = styled.h1`
  font-size: 2em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 0.25em;
`;

export const PageSubTitle = styled.h2`
  font-size: 1.5em;
  font-weight: bold;
  color: ${colors.text};
  margin: 0 0 0.25em;
`;

export const Description = styled.p`
  margin: 0 0 1.5rem;
  font-size: 1.125rem;
  font-weight: 400;
  color: ${colors.text};
`;

export const InlineDescription = styled(Description)`
  display: inline-block;
  margin-right: 0.5rem;
`;

export const InlineDescriptionBold = styled(Description)`
  display: inline-block;
  margin-right: 0.5rem;
  font-weight: bold;
`;

export const Link = styled.a`
  margin: 0 0 1rem;
  font-size: 1.125rem;
  display: block;
`;

export const ButtonLink = styled.button`
  background: none !important;
  border: none;
  padding: 0 !important;
  margin: 0 0.5rem 1rem 0;
  font-size: 1.125rem;
  display: block;
  /* font-family: arial, sans-serif; */
  color: ${colors.blue};
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
`;

export const InlineLink = styled(Link)`
  display: inline-block;
  margin-right: 0.5rem;
`;

export const PasswordLink = styled(Link)`
  margin-bottom: 2rem;
`;

export const CheckBoxField = styled(Field)`
  display: block;
  margin: 0;
  display: inline-flex;
  width: 100%;
  margin-left: 0;
`;

export const CheckboxInput = styled(Input).attrs({ type: "checkbox" })`
  flex: 0 0 auto;
  margin-top: 0.05em;
  min-width: 22px;
`;
