import React from "react";
import styled, { css } from "styled-components";
import PropType from "prop-types";

const errorNoHeader = css`
  background: ${({ theme }) => theme.colors.errorSecondary};
  border-color: ${({ theme }) => theme.colors.errors};
  padding: 1rem;
`;

const errorWithHeader = css`
  background: ${({ theme }) => theme.colors.errorSecondary};
  border-color: ${({ theme }) => theme.colors.errors};
  position: relative;
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

const ErrorNoHeaderTitle = styled.div`
  color: ${({ theme }) => theme.colors.rubyRed};
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
  icon,
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
      {paragraphLabel && variant === "errorNoHeader" && (
        <ErrorNoHeaderTitle>{paragraphLabel}</ErrorNoHeaderTitle>
      )}
      {variant === "success" && (
        <SuccessPanelIconContainer>
          <SpanIcon>
            <StyledImage src={icon} />
          </SpanIcon>
        </SuccessPanelIconContainer>
      )}
      <Container variant={variant}>
        {paragraphLabel && variant === "errorWithHeader" && (
          <ErrorNoHeaderTitle>{paragraphLabel}</ErrorNoHeaderTitle>
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
  icon: PropType.node,
};

Panel.defaultProps = {
  variant: "info",
  type: "panel",
};

export default Panel;
