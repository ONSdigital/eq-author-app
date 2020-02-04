import React from "react";
import PropTypes from "prop-types";

import { SectionTitle } from "../Menu";
import SubMenu from "./SubMenu";

const FlatSectionMenu = ({ data, ...otherProps }) =>
  data.map(section => (
    <div key={section.id}>
      <SectionTitle>{section.displayName}</SectionTitle>
      <SubMenu pages={section.pages} {...otherProps} />
    </div>
  ));

FlatSectionMenu.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
    })
  ),
};

export default FlatSectionMenu;
