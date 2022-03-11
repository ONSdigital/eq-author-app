import * as Headings from "constants/table-headings";

const tableHeadings = [
  {
    heading: Headings.TITLE,
    colWidth: "20%",
    sortColumn: "title",
    sortable: true,
  },
  {
    heading: Headings.OWNER,
    colWidth: "15%",
    sortColumn: "createdBy.displayName",
    sortable: true,
  },
  {
    heading: Headings.CREATED,
    colWidth: "10%",
    sortColumn: "createdAt",
    sortable: true,
  },
  {
    heading: Headings.MODIFIED,
    colWidth: "11%",
    sortColumn: "updatedAt",
    sortable: true,
  },
  {
    heading: Headings.LOCKED,
    colWidth: "9%",
    sortColumn: "locked",
    sortable: true,
  },
  {
    heading: Headings.STARRED,
    colWidth: "10%",
    sortColumn: "starred",
    sortable: true,
  },
  {
    heading: Headings.ACCESS,
    colWidth: "10%",
    sortColumn: "permission",
    sortable: true,
  },
  {
    heading: Headings.ACTIONS,
    colWidth: "9%",
  },
];

export default tableHeadings;
