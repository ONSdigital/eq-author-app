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
    colWidth: "9%",
    sortColumn: "updatedAt",
    sortable: true,
  },
  {
    heading: Headings.PERMISSIONS,
    colWidth: "10%",
  },
  {
    heading: Headings.LOCKED,
    colWidth: "8%",
    sortColumn: "locked",
    sortable: true,
  },
  {
    heading: Headings.STARRED,
    colWidth: "8%",
    sortColumn: "starred",
    sortable: true,
  },
  {
    heading: Headings.ACTIONS,
    colWidth: "9%",
  },
];

export default tableHeadings;
