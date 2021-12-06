import React from "react";
import styled, { css } from "styled-components";
import PropType from "prop-types";
import iconCheckbox from "../../assets/icon-panel-checkbox.svg";

const getThemeColor = (variant) => {
  switch (variant) {
    case "info":
      return ({ theme }) => theme.colors.info;
    case "errorNoHeader":
      return ({ theme }) => theme.colors.errors;
    case "errorWithHeader":
      return ({ theme }) => theme.colors.errors;
    case "success":
      return ({ theme }) => theme.colors.success;
    default:
      return;
  }
};

const errorNoHeader = css`
  background: ${({ theme }) => theme.colors.errorSecondary};
  border-color: ${({ theme }) => theme.colors.errors};
  padding: 1rem;
`;

const errorWithHeader = css`
  background: ${({ theme }) => theme.colors.errorSecondary};
  border-color: ${({ theme }) => theme.colors.errors};
  position: relative;
  padding-bottom: 0;
  ol {
    margin: 0 0 1rem;
    margin-bottom: 0;
    padding: 0 0 0 1.5rem;
    li {
      margin-bottom: 0.5rem;
    }
    li:last-child {
      margin-bottom: 0;
    }
  }
`;

const infoPanel = css`
  background: ${({ theme }) => theme.colors.paleBlue};
  border-color: ${({ theme }) => theme.colors.info};
  padding: 1rem;
`;

const successPanel = css`
  background: ${({ theme }) => theme.colors.lightGreen};
  border-color: ${({ theme }) => theme.colors.success};
  padding: 1rem;
`;

const HeaderLabel = styled.h2`
  font-size: ${({ theme }) => theme.fontSize};
  padding: 0;
  line-height: 0;
`;

const PanelParagraphTitle = styled.div`
  color: ${({ variant }) => getThemeColor(variant)};
  margin: 0 0 1rem;
  font-weight: bold;
`;

const Header = styled.div`
  background: ${({ theme }) => theme.colors.errors};
  color: ${({ theme }) => theme.colors.textInverse};
  display: block;
  border-radius: 0;
  margin: 0;
  padding: 0.75rem 1rem;
  box-sizing: border-box;
  width: 100%;
`;

const SuccessPanelIconContainer = styled.div`
  padding-left: 2rem;
  background: none;
  margin-bottom: 0;
`;

const SpanIcon = styled.span`
  height: 25px;
  width: 36px;
  left: 0;
  padding-left: 1rem;
  position: absolute;
  box-sizing: border-box;
`;

const StyledImage = styled.img`
  margin-top: -15% !important;
  height: 1rem;
  vertical-align: middle;
  width: 1rem;
  box-sizing: border-box;
`;

const Container = styled.div`
  ${({ variant }) =>
    variant === "info" &&
    `
    padding: 0;
    background: none;
    margin-bottom: 0
  `}

  ${({ variant }) =>
    variant === "success" &&
    `
    padding-left: 2rem;
    background: none;
    margin-bottom: 0;
  `}

  ${({ variant }) => variant === "errorWithHeader" && `padding: 1rem;`}
`;

const StyledPanel = styled.div`
  display: block;
  border-radius: 0;
  position: relative;
  border-left: ${(props) => props.withLeftBorder && `8px solid transparent;`};

  ${(props) => props.variant === "info" && infoPanel};
  ${(props) => props.variant === "success" && successPanel};
  ${(props) => props.variant === "errorWithHeader" && errorWithHeader};
  ${(props) => props.variant === "errorNoHeader" && errorNoHeader};
`;

const Panel = ({
  paragraphLabel,
  headerLabel,
  variant,
  withLeftBorder,
  children,
}) => {
  return (
    <StyledPanel variant={variant} withLeftBorder={withLeftBorder}>
      {variant === "errorWithHeader" && (
        <>
          <Header>
            <HeaderLabel> {headerLabel} </HeaderLabel>
          </Header>
        </>
      )}
      {variant === "success" && (
        <SuccessPanelIconContainer>
          <SpanIcon>
            <StyledImage src={iconCheckbox} />
          </SpanIcon>
        </SuccessPanelIconContainer>
      )}
      <Container variant={variant}>
        {paragraphLabel && (
          <PanelParagraphTitle variant={variant}>
            {paragraphLabel}
          </PanelParagraphTitle>
        )}
        {children}
      </Container>
    </StyledPanel>
  );
};

Panel.propTypes = {
  variant: PropType.string,
  children: PropType.node,
  paragraphLabel: PropType.string,
  headerLabel: PropType.string,
  withLeftBorder: PropType.bool,
};

Panel.defaultProps = {
  variant: "info",
  type: "panel",
};

export default Panel;
