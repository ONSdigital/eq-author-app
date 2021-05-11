import * as Headings from "constants/table-headings";

const tableHeadings = [
  {
    heading: Headings.TITLE,
    colWidth: "20%",
    sortColumn: "title",
    sortable: true,
    enabled: true,
  },
  {
    heading: Headings.OWNER,
    colWidth: "15%",
    sortColumn: "createdBy.displayName",
    sortable: true,
    enabled: true,
  },
  {
    heading: Headings.CREATED,
    colWidth: "10%",
    sortColumn: "createdAt",
    sortable: true,
    enabled: true,
  },
  {
    heading: Headings.MODIFIED,
    colWidth: "9%",
    sortColumn: "updatedAt",
    sortable: true,
    enabled: true,
  },
  {
    heading: Headings.PERMISSIONS,
    colWidth: "10%",
    enabled: true,
  },
  {
    heading: Headings.LOCKED,
    colWidth: "8%",
    sortColumn: "locked",
    sortable: true,
    enabled: true,
  },
  {
    heading: Headings.STARRED,
    colWidth: "8%",
    sortColumn: "starred",
    sortable: true,
    enabled: true,
  },
  {
    heading: Headings.ACTIONS,
    colWidth: "9%",
    enabled: true,
  },
];

export default tableHeadings;
