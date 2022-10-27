import React from "react";
import styled, { css } from "styled-components";
import PropType from "prop-types";
import { ReactComponent as Icon } from "../../assets/icon-panel-checkbox.svg";
import { ButtonLink } from "components-themed/Toolkit";

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

const Flex = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  font-weight: ${({ bold }) => bold && "bold"};
  font-size: ${({ fontSize }) => fontSize};
`;

const HeaderLabel = styled.h2`
  font-size: ${({ theme }) => theme.fontSize};
  padding: 0;
  line-height: 0;
`;

const PanelParagraphTitle = styled.div`
  color: ${({ variant }) => getThemeColor(variant)};
  margin: 0 0 0.5rem;
  font-weight: ${({ withList }) => !withList && "bold"};
  li {
    color: ${({ theme }) => theme.colors.black};
  }
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

const WarningIcon = styled.div`
  min-height: 2rem;
  min-width: 2rem;
  line-height: 2rem;
  background-color: ${({ theme }) => theme.colors.black};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  display: inline-block;
  font-weight: bold;
  text-align: center;
  font-size: 1.5rem;
  margin-right: 1rem;
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
  margin-bottom: ${(props) => props.withPanelMargin && `1rem`};
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
  withList,
  handleLinkToAnchor,
  innerRef,
  withPanelMargin,
}) => {
  return (
    <StyledPanel
      variant={variant}
      withPanelMargin={withPanelMargin}
      withLeftBorder={withLeftBorder}
    >
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
            <Icon />
          </SpanIcon>
        </SuccessPanelIconContainer>
      )}
      {variant === "warning" && (
        <Flex bold fontSize="18px">
          <WarningIcon>!</WarningIcon>
          {children}
        </Flex>
      )}
      <Container variant={variant}>
        {paragraphLabel && (
          <PanelParagraphTitle variant={variant} withList={withList}>
            {withList ? (
              <ol>
                <li>
                  <ButtonLink
                    onClick={() => handleLinkToAnchor(innerRef)}
                    name="panel-head-error"
                  >
                    {paragraphLabel}
                  </ButtonLink>
                </li>
              </ol>
            ) : (
              <div ref={innerRef} id={paragraphLabel}>
                {paragraphLabel}
              </div>
            )}
          </PanelParagraphTitle>
        )}
        {variant !== "warning" && children}
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
  withList: PropType.bool,
  handleLinkToAnchor: PropType.func,
  // eslint-disable-next-line react/forbid-prop-types
  innerRef: PropType.object,
  withPanelMargin: PropType.bool,
};

Panel.defaultProps = {
  variant: "info",
  withList: false,
  withPanelMargin: true,
};

export default Panel;
