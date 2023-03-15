const executeQuery = require("../../tests/utils/executeQuery");

const query = `
query GetPrepopSchemaVersions($id: ID!) {
    prepopSchemaVersions(id: $id) {
      surveyId
      versions {
        id
        version
        dateCreated
      }
    }
  }
`;

// let surveyId;
// const mocks = [
//   {
//     request: {
//       query: query,
//       variables: {
//         id: surveyId,
//       },
//     },
//     result: () => {
//       return {
//         data: {
//           surveyId: "624",
//           versions: [
//             {
//               id: "624-111-789",
//               version: "1",
//               dateCreated: "2023-01-12T13:37:27+00:00",
//             },
//             {
//               id: "624-222-789",
//               version: "2",
//               dateCreated: "2023-02-08T12:37:27+00:00",
//             },
//             {
//               id: "624-333-789",
//               version: "3",
//               dateCreated: "2023-03-23T08:37:27+00:00",
//             },
//           ],
//         },
//       };
//     },
//   },
// ];

describe("PrepopSchemaVersions", () => {
  it("should throw error if the ID is undefined", async () => {
    try {
      await executeQuery(query);
    } catch (error) {
      expect(error.message).toMatch(
        `Variable "$id" of required type "ID!" was not provided.`
      );
    }
  });

  //   it("should query prepop schema", async () => {
  //     const response = await executeQuery(query, { id: "121" });
  //     console.log("response", response);
  //   });
});
