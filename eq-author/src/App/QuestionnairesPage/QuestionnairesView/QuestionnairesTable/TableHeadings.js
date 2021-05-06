const tableHeadings = [
  {
    heading: `Title`,
    colWidth: "20%",
    sortColumn: "title",
    sortable: true,
  },
  {
    heading: `Owner`,
    colWidth: "15%",
    sortColumn: "createdBy.displayName",
    sortable: true,
  },
  {
    heading: `Created`,
    colWidth: "10%",
    sortColumn: "createdAt",
    sortable: true,
  },
  {
    heading: `Modified`,
    colWidth: "9%",
    sortColumn: "updatedAt",
    sortable: true,
  },
  {
    heading: `Permissions`,
    colWidth: "10%",
    sortable: false,
  },
  {
    heading: `Locked`,
    colWidth: "8%",
    sortColumn: "locked",
    sortable: true,
  },
  {
    heading: `Starred`,
    colWidth: "8%",
    sortColumn: "starred",
    sortable: true,
  },
  {
    heading: `Actions`,
    colWidth: "9%",
    sortable: false,
  },
];

export default tableHeadings;
