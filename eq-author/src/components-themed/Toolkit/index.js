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

export const Description = styled.p`
  margin: 0 0 1rem;
  font-size: 1.125rem;
  font-weight: 400;
  color: ${colors.text};
`;

export const Link = styled.a`
  margin: 0 0 1rem;
  font-size: 1.125rem;
  display: block;
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

export const OptionLabel = styled.p`
  margin: 0 0 1.5rem 0.5rem;
  align-items: flex-start;
  font-size: 1.125rem;
`;
