import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { map, size, times } from "lodash";

import IconText from "components/IconText";
import Typeahead from "components/Typeahead";
import {
  Table,
  TableHead,
  TableBody,
  TableFoot,
  TableRow,
  TableColumn,
  TableHeadColumn
} from "components/DataTable/Elements";
import {
  AddRowButton,
  TableInput,
  TableInputDate,
  TableSelect,
  TableTypeaheadInput,
  TableTypeaheadMenu,
  DeleteRowButton
} from "components/DataTable/Controls";

import Icon from "./icon-plus.svg?inline";

const Wrapper = styled.div`
  position: absolute;
  padding: 2em;
`;

const input = (
  <TableInput id="table-input" type="text" onChange={action("change")} />
);

const date = (
  <TableInputDate id="table-date" type="date" onChange={action("change")} />
);

const select = selected => (
  <TableSelect value={selected} onChange={action("change")} id="options">
    <option value="1">Option 1</option>
    <option value="2">Option 2</option>
    <option value="3">Option 3</option>
  </TableSelect>
);
const items = [{ value: "apple" }, { value: "pear" }, { value: "orange" }];

const typeahead = (
  <Typeahead onChange={action("change")}>
    {({ getInputProps, isOpen, openMenu, ...otherProps }) => (
      <div>
        <TableTypeaheadInput {...getInputProps({ onFocus: openMenu })} />
        {isOpen && <TableTypeaheadMenu items={items} {...otherProps} />}
      </div>
    )}
  </Typeahead>
);

const header = [
  {
    name: "Heading 1",
    width: 15
  },
  {
    name: "Heading 2",
    width: 20
  },
  {
    name: "Heading 3",
    width: 20
  },
  {
    name: "Heading 4",
    width: 40
  }
];

const row = () => [typeahead, input, select(1), date];

const content = times(4, row);

const Decorator = storyFn => <Wrapper>{storyFn()}</Wrapper>;

storiesOf("DataTable", module)
  .addDecorator(Decorator)
  .add("With dynamic content", () => (
    <Table>
      <TableHead>
        <TableRow>
          {map(header, ({ name, width }, index) => (
            <TableHeadColumn key={`dt-th-${index}`} width={`${width}%`}>
              {name}
            </TableHeadColumn>
          ))}
          <TableHeadColumn width="36px" />
        </TableRow>
      </TableHead>
      <TableBody>
        <React.Fragment>
          {map(content, (row, rowIndex) => {
            return (
              <TableRow key={`dt-row-${rowIndex}`}>
                {map(row, (col, colIndex) => (
                  <TableColumn key={`dt-col-${colIndex}`}>{col}</TableColumn>
                ))}
                <TableColumn>
                  <DeleteRowButton
                    size="medium"
                    onClick={action("deleteRow")}
                  />
                </TableColumn>
              </TableRow>
            );
          })}
        </React.Fragment>
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableColumn colSpan={size(header) + 1}>
            <AddRowButton onClick={action("addRow")} variant="tertiary" small>
              <IconText icon={Icon} dark>
                Add row
              </IconText>
            </AddRowButton>
          </TableColumn>
        </TableRow>
      </TableFoot>
    </Table>
  ));
