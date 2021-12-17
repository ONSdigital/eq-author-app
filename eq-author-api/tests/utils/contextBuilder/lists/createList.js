// const executeQuery = require("../../executeQuery");
// const { filter } = require("graphql-anywhere");
// const gql = require("graphql-tag");

// const createListMutation = `
//   mutation CreateList($input: CreateListInput!) {
//     createList(input: $input) {
//       id
//       listName
//       displayName
//       answers
//       ...on BasicAnswer{
//         validation {
//
//         }
//       }
//       ... on MultipleChoiceAnswer {
//         mutuallyExclusiveOption {
//           id
//         }
//         options {
//           id
//           displayName
//           label
//           description
//           value
//           qCode
//           answer {
//             id
//           }
//           additionalAnswer {
//             id
//           }
//         }
//       }
//     }
//   }
// `;

// const createList = async (ctx, input) => {
//   const result = await executeQuery(
//     createListMutation,
//     {
//       input: filter(
//         gql`
//           {
//             description
//             guidance
//             label
//             secondaryLabel
//             qCode
//             type
//             questionPageId
//           }
//         `,
//         input
//       ),
//     },
//     ctx
//   );

//   if (result.errors) {
//     throw new Error(result.errors[0].message);
//   }

//   return result.data.createList;
// };

// module.exports = {
//   createListMutation,
//   createList,
// };
