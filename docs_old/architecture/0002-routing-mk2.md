# 2. Routing Mk2

Date: 2018-12-20

## Status

Accepted

## Context

Routing is a system to allow a user to describe conditions as to where the survey respondent should go after they complete the answers on a question page.

As these conditions can be any boolean expression we need a more complex routing structure to handle

## Decision

Implement a new version of the routing in the API that can handle nested expressions.

This is heavily inspied by https://github.com/ONSdigital/eq-author-app/wiki/Routing,-MK2

### Terminology

- Routing - all rules etc for a page with a fallback destination when no rules match.
- Rule - a series of expressions that when evaluated to true will go to the destination specified.
- Expression - Either a binary expression or expression group
- Expression Group - A group of BinaryExpressions combined as either `and` or `or`.
- Binary Expression - The base item with a left hand side, condtion and right hand side.
- Left hand side - The item being compared against (e.g. a question)
- Condition - A way of comparing left and right e.g. `=`, `>`, `>=`, `includes`, `not_includes`
- Right hand side - The value being compared against a left.

### Example

On page 1, when the user enters 5 go to page 2, when they select red or white go to page 3, otherwise go to page 4.

```
page: {
  title: "Page 1",
  answers: [
    { id: "answer1", type: NUMBER, label: "Answer" }
  ],
  routing: {
    rules: [
      {
        expressionGroup: {
          operator: "AND",
          expressions: [
            {
              left: {
                answer: {
                  id: "Answer1",
                  type: CURRENCY
                }
              },
              condition: "Equals",
              right: {
                number: 5
              }
            }
          ]
        },
        destination: {
          page: {
            id: "Page2"
          }
        }
      },
      {
        expressionGroup: {
          operator: "OR",
          expressions: [
            {
              left: {
                answer: {
                  id: "Answer2",
                  type: RADIO
                }
              },
              condition: "OneOf",
              right: {
                options: [
                  {
                    value: "red"
                  },
                  {
                    value: "white"
                  }
                ]
              }
            }
          ]
        },
        destination: {
          page: {
            id: "Page3"
          }
        }
      }
    ],
    else: {
      page: {
        id: "Page4"
      }
    }
  }
}
```

## Consequences

This should allow us to build arbitrarily complex routing rules without further changes to the routing graphql structure.
