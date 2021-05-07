const tableHeadings = [
  {
    heading: `Title`,
    colWidth: "20%",
    sortColumn: "title",
    sortable: true,
    enabled: true,
  },
  {
    heading: `Owner`,
    colWidth: "15%",
    sortColumn: "createdBy.displayName",
    sortable: true,
    enabled: true,
  },
  {
    heading: `Created`,
    colWidth: "10%",
    sortColumn: "createdAt",
    sortable: true,
    enabled: true,
  },
  {
    heading: `Modified`,
    colWidth: "9%",
    sortColumn: "updatedAt",
    sortable: true,
    enabled: true,
  },
  {
    heading: `Permissions`,
    colWidth: "10%",
    enabled: true,
  },
  {
    heading: `Locked`,
    colWidth: "8%",
    sortColumn: "locked",
    sortable: true,
    enabled: true,
  },
  {
    heading: `Starred`,
    colWidth: "8%",
    sortColumn: "starred",
    sortable: true,
    enabled: true,
  },
  {
    heading: `Actions`,
    colWidth: "9%",
    enabled: true,
  },
];

export default tableHeadings;
