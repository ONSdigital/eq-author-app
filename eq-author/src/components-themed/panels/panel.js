import React from "react";
import styled, { css } from "styled-components";
import PropType from "prop-types";
import { darken } from "polished";
import iconCheckbox from "assets/icon-panel-checkbox.svg";
 
const HeaderLabel = styled.h2`
    font-size: ${({ theme }) => theme.fontSize};
    padding: 0;
    line-height: 0;
`;

const errorNoHeader = css`
    background: ${({ theme }) => theme.colors.errorSecondary};
    border-color: ${({ theme }) => theme.colors.errors};
    padding: 1rem;
`

const ErrorNoHeaderTitle = styled.div`
    color: ${({ theme }) => theme.colors.rubyRed};
    margin: 0 0 1rem;
    font-weight: bold;
`

const errorWithHeader = css`
    background: ${({ theme }) => theme.colors.errorSecondary};
    border-color: ${({ theme }) => theme.colors.errors};
    border-left: none;
    position: relative;

    .ons-panel-header {
    background: ${({ theme }) => theme.colors.errors};
    color: ${({ theme }) => theme.colors.textInverse};
    display: block;
    border-radius: 0;
    margin: 0;
    padding: 0.75rem 1rem;
    box-sizing: border-box;
    width: 100%;
    }

    .panel-body {
        padding: 1rem;
    }
`;

const infoPanel = css`
    background: ${({ theme }) => theme.colors.paleBlue};
    border-color: ${({ theme }) => theme.colors.info};
    padding: 1rem;
    .panel-body {
        padding: 0;
        background: none;
    }
    .panel-body:last-child{
        margin-bottom: 0;
    }
`;


const successPanel = css`
    background: ${({ theme }) => theme.colors.lightGreen};
    border-color: ${({ theme }) => theme.colors.success};
    padding: 1rem;
    .panel-body {
        padding-left: 2rem;
        background: none;
    }
    .panel-body:last-child{
        margin-bottom: 0;
    }
`;

const SpanIcon = styled.span`
    height: 25px;
    width: 36px;
    left: 0;
    padding-left: 1rem;
    position: absolute;
    box-sizing: border-box;
`;

const StyledImage = styled.img `
    margin-top: -15%!important;
    height: 1rem;
    vertical-align: middle;
    width: 1rem;
    box-sizing: border-box;
`;


const StyledPanel = styled.div`
    display: block;
    border-radius: 0;
    position: relative;
    border-left: 9px solid transparent;

    ${(props) => props.variant === "infomation" && infoPanel};
    ${(props) => props.variant === "success" && successPanel};
    ${(props) => props.variant === "errorWithHeader" && errorWithHeader};
    ${(props) => props.variant === "errorNoHeader" && errorNoHeader};
`;

const Panel = ({paragraphLabel, headerLabel, variant, children}) => {
    return (
        <StyledPanel variant={variant}> 
        {variant === "errorWithHeader" && <div className="ons-panel-header"><HeaderLabel> {headerLabel} </HeaderLabel></div>}
        {variant === "errorNoHeader" && <ErrorNoHeaderTitle>{paragraphLabel}</ErrorNoHeaderTitle>}
            <div className="panel-body">
                {/* {variant ==="errorNoHeader" && <p className="ons-panel-error"><strong>{paragraphLabel}</strong></p>} */}
                {variant== "success" && <SpanIcon><StyledImage src={iconCheckbox}/></SpanIcon>}
                {children}
            </div>
        </StyledPanel>
    );
};

Panel.propTypes = {
    variant: PropType.string,
    children: PropType.node,
};

Panel.defaultProps = {
    type: "panel",
};

export default Panel;