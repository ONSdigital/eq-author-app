import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { camelCase } from "lodash";
import { colors } from "constants/theme";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1em;
`;

const ColourContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  margin-right: 2em;
  margin-bottom: 2em;
`;

const Caption = styled.p`
  margin: 0 auto;
  margin-top: 1em;
  width: 6em;
  font-weight: bold;
`;

const SubCaption = styled.p`
  margin: 0;
  font-size: 0.8em;
`;

const Circle = styled.div`
  height: 5em;
  width: 5em;
  background-color: ${({ colour }) => colour};
  border-radius: 50%;
  border: 1px solid ${colors.darkerBlack};
  display: inline-block;
  margin: 0 auto;
`;

export const Colour = ({ colour, name }) => (
  <ColourContainer>
    <Circle colour={colour} />
    <Caption>{name}</Caption>
    <SubCaption>{colour}</SubCaption>
    <SubCaption>colors.{camelCase(name)}</SubCaption>
  </ColourContainer>
);

Colour.propTypes = {
  colour: PropTypes.string,
  name: PropTypes.string,
};

export const Palette = () => (
  <>
    <Container>
      <Colour colour={colors.blue} name="Blue" />
      <Colour colour={colors.paleBlue} name="Pale blue" />
      <Colour colour={colors.lightBlue} name="Light blue" />
      <Colour colour={colors.highlightBlue} name="Highlight blue" />
      <Colour colour={colors.mediumBlue} name="Medium blue" />
      <Colour colour={colors.darkBlue} name="Dark blue" />
      <Colour colour={colors.darkerBlue} name="Darker blue" />
    </Container>
    <Container>
      <Colour colour={colors.black} name="Black" />
      <Colour colour={colors.sidebarBlack} name="Sidebar black" />
    </Container>
    <Container>
      <Colour colour={colors.grey} name="Grey" />
      <Colour colour={colors.mediumGrey} name="Medium grey" />
      <Colour colour={colors.darkGrey} name="Dark grey" />
      <Colour colour={colors.lightGrey} name="Light grey" />
      <Colour colour={colors.lightMediumGrey} name="Light medium grey" />
      <Colour colour={colors.lighterGrey} name="Lighter grey" />
      <Colour colour={colors.grey} name="Grey" />
    </Container>
    <Container>
      <Colour colour={colors.green} name="Green" />
      <Colour colour={colors.lightGreen} name="Light green" />
      <Colour colour={colors.highlightGreen} name="Highlight green" />
    </Container>
    <Container>
      <Colour colour={colors.red} name="Red" />
      <Colour colour={colors.orange} name="Orange" />
      <Colour colour={colors.amber} name="Amber" />
      <Colour colour={colors.greyedOrange} name="Greyed orange" />
      <Colour colour={colors.lightOrange} name="Light orange" />
      <Colour colour={colors.darkOrange} name="Dark orange" />
    </Container>
    <Container>
      <Colour colour={colors.white} name="White" />
    </Container>
  </>
);

export const Semantic = () => (
  <Container>
    <Colour colour={colors.primary} name="Primary" />
    <Colour colour={colors.secondary} name="Secondary" />
    <Colour colour={colors.tertiary} name="Tertiary" />
    <Colour colour={colors.positive} name="Positive" />
    <Colour colour={colors.negative} name="Negative" />
    <Colour colour={colors.text} name="Text" />
    <Colour colour={colors.textLight} name="Text light" />
    <Colour colour={colors.borders} name="Borders" />
    <Colour colour={colors.bordersLight} name="Borders light" />
    <Colour colour={colors.previewError} name="Preview error" />
    <Colour colour={colors.errorPrimary} name="Error primary" />
    <Colour colour={colors.errorSecondary} name="Error secondary" />
    <Colour
      colour={colors.badgeSelectedBackground}
      name="Badge selected background"
    />
    <Colour colour={colors.badgeSelectedText} name="Badge selected text" />
    <Colour
      colour={colors.calcSumEmptyContent}
      name="Calculated summary empty content"
    />
  </Container>
);
