import styled from "styled-components";
import PropTypes from "prop-types";
import alertIcon from "./alert.min.svg";

export const DialogAlertList = styled.ul`
  margin: 0;
`;

DialogAlertList.propTypes = {
  children: PropTypes.node
};

export const DialogAlert = styled.li`
  list-style-image: url(${alertIcon});
  padding: 1em 0;
  font-size: 0.75em;
`;

DialogAlert.propTypes = {
  children: PropTypes.node
};
