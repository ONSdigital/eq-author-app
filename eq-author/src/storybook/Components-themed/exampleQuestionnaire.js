import React from "react";

const questionnaires = [
  {
    id: `questionnaire1`,
    displayName: `Questionnaire 1`,
    title: `Questionnaire 1Title`,
    shortTitle: "hi",
    createdAt: `2019-05-29T12:36:50.984Z`,
    updatedAt: `2019-05-29T12:36:50.984Z`,
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
    createdAt: `2019-05-19T12:36:50.984Z`,
    updatedAt: `2019-05-19T12:36:50.984Z`,
    createdBy: {
      name: "klan",
      email: "Alan@Hello.com",
      displayName: "klan",
    },
    permission: "Read",
    publishStatus: "Unpublished",
    starred: false,
    locked: false,
  },
];

export default questionnaires;
