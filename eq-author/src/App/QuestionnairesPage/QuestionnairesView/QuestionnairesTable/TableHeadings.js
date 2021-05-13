import * as Headings from "constants/table-headings";

const tableHeadings = [
  {
    heading: Headings.TITLE,
    colWidth: "20%",
    sortColumn: "title",
    sortable: true,
    enabled: false,
  },
  {
    heading: Headings.OWNER,
    colWidth: "15%",
    sortColumn: "createdBy.displayName",
    sortable: true,
    enabled: false,
  },
  {
    heading: Headings.CREATED,
    colWidth: "10%",
    sortColumn: "createdAt",
    sortable: true,
    enabled: false,
  },
  {
    heading: Headings.MODIFIED,
    colWidth: "9%",
    sortColumn: "updatedAt",
    sortable: true,
    enabled: false,
  },
  {
    heading: Headings.PERMISSIONS,
    colWidth: "10%",
    enabled: false,
  },
  {
    heading: Headings.LOCKED,
    colWidth: "8%",
    sortColumn: "locked",
    sortable: true,
    enabled: false,
  },
  {
    heading: Headings.STARRED,
    colWidth: "8%",
    sortColumn: "starred",
    sortable: true,
    enabled: false,
  },
  {
    heading: Headings.ACTIONS,
    colWidth: "9%",
    enabled: false,
  },
];

export default tableHeadings;
