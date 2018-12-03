import React from "react";

import RichTextEditor from "components/RichTextEditor";
import styled, { css } from "styled-components";
import { colors } from "constants/theme";

import { Input } from "components/Forms";
import DetailsEditor from "./DetailsEditor";

const Section = styled.section`
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 2em;
`;

const Padding = styled.div`
  padding: 0 2em;
`;

const SectionTitle = styled.h2`
  font-size: 1.1em;
  font-weight: bold;
  /* text-transform: uppercase;
  letter-spacing: 0.05em; */
  color: ${colors.text};
  margin: 0 0 1em;
`;

const SectionDescription = styled.p`
  margin: 0.1em 0 1em;
  color: ${colors.textLight};
`;

const Box = styled.div`
  border: 1px solid ${colors.bordersLight};
  padding: 1em;
  border-radius: 4px;
  margin-bottom: 2em;
`;

const disabled = css`
  opacity: 0.4;
  pointer-events: none;
`;

const Toggle = styled.div`
  transition: opacity 300ms ease-in-out;
  ${props => !props.enabled && disabled};
`;

const titleControls = {
  emphasis: true,
  piping: true,
  link: false
};

const descriptionControls = {
  bold: true,
  emphasis: true,
  piping: true,
  list: true,
  link: true
};

const LegalField = styled.div`
  display: flex;
  margin-bottom: 2em;
`;

const LegalInput = styled(Input)`
  position: absolute;
  overflow: hidden;
  clip: rect(0 0 0 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  &:hover,
  &:focus {
    border: none;
    outline: none;
    box-shadow: none;
  }
`;

const LegalLabel = styled.label`
  display: block;
  padding: 1.5em;
  border-radius: 4px;
  border: 1px solid ${colors.bordersLight};
  flex: 1 1 33.3333333%;
  text-align: center;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.18);
  color: ${colors.textLight};
  height: 13em;
  transition: all 200ms ease-in-out;

  &:not(:last-of-type) {
    margin-right: 1em;
  }

  &:focus-within {
    border-color: ${colors.blue};
    outline-color: ${colors.blue};
    box-shadow: 0 0 0 3px ${colors.tertiary};
  }

  ${props =>
    props.selected &&
    css`
      border: 2px solid ${colors.primary};
    `};
`;

const LegalTitle = styled.span`
  font-size: 0.85em;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 1em;
  color: ${colors.text};
`;

const LegalNotice = styled.span`
  font-weight: bold;
  margin-bottom: 1em;
`;

const LegalDescription = styled.span`
  font-size: 1em;
`;

const LegalOption = ({ id, onChange, legalValue, children }) => (
  <LegalLabel htmlFor={id} selected={legalValue === id}>
    <LegalInput
      type="radio"
      name="legal"
      id={id}
      value={id}
      onChange={onChange}
    />
    {children}
  </LegalLabel>
);

const QuestionnaireIntroEditor = ({
  questionnaire,
  intro,
  enabled,
  addDetail,
  removeDetail,
  moveDetailUp,
  moveDetailDown,
  onChange,
  updateDetail
}) => {
  const {
    details,
    title,
    description,
    secondaryTitle,
    secondaryDescription,
    tertiaryTitle,
    tertiaryDescription,
    legal
  } = intro;
  const { metadata } = questionnaire;

  return (
    <Toggle enabled={enabled}>
      <Section>
        <Padding>
          <SectionTitle>Introduction</SectionTitle>
          <RichTextEditor
            id="intro-title"
            name="title"
            label="Title"
            value={title}
            onUpdate={onChange}
            controls={titleControls}
            metadata={metadata}
            size="large"
            autoFocus={enabled}
          />
          <RichTextEditor
            id="intro-description"
            name="description"
            label="Description"
            value={description}
            onUpdate={onChange}
            metadata={metadata}
            controls={descriptionControls}
            multiline
          />
          {questionnaire.theme === "default" && (
            <>
              <SectionTitle>Legal basis</SectionTitle>
              <LegalField>
                <LegalOption
                  id="notice-1"
                  legalValue={legal}
                  onChange={onChange}
                >
                  <LegalTitle>Notice 1</LegalTitle>
                  <LegalNotice>
                    Your response is <br /> legally required
                  </LegalNotice>
                  <LegalDescription>
                    Notice is given under section 1 of the Statistics of Trade
                    Act 1947.
                  </LegalDescription>
                </LegalOption>
                <LegalOption
                  id="notice-2"
                  legalValue={legal}
                  onChange={onChange}
                >
                  <LegalTitle>Notice 2</LegalTitle>
                  <LegalNotice>
                    Your response is <br />
                    legally required
                  </LegalNotice>
                  <LegalDescription>
                    Notice is given under sections 3 and 4 of the Statistics of
                    Trade Act 1947.
                  </LegalDescription>
                </LegalOption>
                <LegalOption
                  id="voluntary"
                  legalValue={legal}
                  onChange={onChange}
                >
                  <LegalTitle>Voluntary</LegalTitle>
                  <LegalDescription>
                    No legal notice will be displayed.
                  </LegalDescription>
                </LegalOption>
              </LegalField>
            </>
          )}
        </Padding>
      </Section>
      <Section>
        <Padding>
          <SectionTitle style={{ marginBottom: "0" }}>
            Secondary content
          </SectionTitle>
          <SectionDescription>
            This content is displayed below the “start survey” button.
          </SectionDescription>
          <RichTextEditor
            id="secondary-title"
            name="secondaryTitle"
            label="Title"
            value={secondaryTitle}
            onUpdate={onChange}
            controls={titleControls}
            metadata={metadata}
            size="large"
          />
          <RichTextEditor
            id="secondary-description"
            name="secondaryDescription"
            label="Description"
            value={secondaryDescription}
            onUpdate={onChange}
            metadata={metadata}
            controls={descriptionControls}
            multiline
          />
          <SectionTitle style={{ marginBottom: "0" }}>
            Collapsibles
          </SectionTitle>
          <SectionDescription>
            Information which is displayed in a collapsible “twistie”.
          </SectionDescription>
          <DetailsEditor
            details={details}
            onAddDetail={addDetail}
            onRemoveDetail={removeDetail}
            onMoveDetailUp={moveDetailUp}
            onMoveDetailDown={moveDetailDown}
            metadata={metadata}
            onChange={updateDetail}
          />
        </Padding>
      </Section>
      <Section>
        <Padding>
          <SectionTitle>Tertiary content</SectionTitle>
          <RichTextEditor
            id="tertiary-title"
            name="tertiaryTitle"
            label="Title"
            value={tertiaryTitle}
            onUpdate={onChange}
            controls={titleControls}
            metadata={metadata}
            size="large"
          />
          <RichTextEditor
            id="tertiary-description"
            name="tertiaryDescription"
            label="Description"
            value={tertiaryDescription}
            onUpdate={onChange}
            metadata={metadata}
            controls={descriptionControls}
            multiline
          />
        </Padding>
      </Section>
    </Toggle>
  );
};

export default QuestionnaireIntroEditor;
