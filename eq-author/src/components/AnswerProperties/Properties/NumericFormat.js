import React from "react";

import { Select } from "components/Forms";

const NumericFormat = ({ type, ...otherProps }) => (
  <Select disabled {...otherProps}>
    <option value="pounds">Pounds</option>
    <option value="pounds-pence">Pounds/Pence</option>
  </Select>
);

export default NumericFormat;
