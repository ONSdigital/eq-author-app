import React from "react";
// const questionnaires =
//  {
//     id: "1",
//     displayName: "Foo",
//     shortTitle: "Test title",
//     createdAt: "2017/01/02",
//     updatedAt: "2017/01/03",
//     locked: false,
//     sections: [
//       {
//         id: "1",
//         pages: [{ id: "1" }],
//       },
//     ],
//     createdBy: {
//       name: "Alan",
//       email: "Alan@Hello.com",
//       displayName: "Alan",
//     }

// };

const questionnaires = [
  {
    id: `questionnaire1`,
    displayName: `Questionnaire 1`,
    title: `Questionnaire 1Title`,
    shortTitle: "",
    createdAt: `2019-05-29 T12:36:50.984Z`,
    updatedAt: `2019-05-29 T12:36:50.984Z`,
    createdBy: {
      name: "Alan",
      email: "Alan@Hello.com",
      displayName: "Alan",
    },
    permission: "Write",
    publishStatus: "Unpublished",
    starred: false,
    locked: false,
  },
  {
    id: `questionnaire2`,
    displayName: `Questionnaire 2`,
    title: `Questionnaire 2Title`,
    shortTitle: "",
    createdAt: `2019-05-19 T12:36:50.984Z`,
    updatedAt: `2019-05-19 T12:36:50.984Z`,
    createdBy: {
      name: "klan",
      email: "Alan@Hello.com",
      displayName: "klan",
    },
    permission: "Write",
    publishStatus: "Unpublished",
    starred: false,
    locked: false,
  },
];

export default questionnaires;
