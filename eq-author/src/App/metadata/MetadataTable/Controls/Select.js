import PropTypes from "prop-types";
import React from "react";
import { flip, map, partial } from "lodash";

import * as metadataTypes from "constants/metadata-types";
import { TableSelect } from "components/datatable/Controls";

const Select = ({ name, options, value, onChange, onUpdate }) => {
  const handleUpdate = partial(flip(onChange), onUpdate);

  return (
    <TableSelect name={name} value={value} onChange={handleUpdate}>
      {map(options, (option, index) => (
        <option key={index} value={option.type}>
          {option.label}
        </option>
      ))}
    </TableSelect>
  );
};

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.oneOf(Object.values(metadataTypes))),
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Select;
