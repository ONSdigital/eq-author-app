# 5. Global validation updates

Date: 2019-06-04

## Status

Accepted

## Context

When a part of the questionnaire is invalid we need to stop it from being launched so the users are
not presented with publishing or launching errors unnecessarily. This means that all mutations could
cause this button to be enabled/disabled.

Additionally the count of the errors on any page could be affected by a large number of mutations on
other pages e.g. moving one page could break routing any of the other pages.

We need a simple and consistent method for updating this information that does not place unnecessary 
burden on adding new mutations or adding more validations.

We originally investigated requerying the whole tree after each mutation however it came with a few
problems:
- each mutation needs to know the whole questionnaire tree
- all mutations need to change
- all features need to support this

Secondly we spiked a basic implementation of using graphql subscriptions. Subscriptions allow a
client to subscribe to changes from the server and is pushed the change as soon as the server knows
about it. This can be subscribed to in one or multiple locations in the app as necessary.

## Decision

We decided to use subscriptions as they are the most flexible and reduce the burden on future
features or changes to validation.

A subscription will be exposed to allow for the client to watch for validation changes. This can be
exposed to the rest of the app using context as this allows for it to be used anywhere in the tree.

The subscription will contain the count of errors for all of those sections and pages that have
validation errors. This reduces the data as we are not sending data about sections and pages that
do not have errors which we expect to be the most common state.

The subscription will also contain the total error count so the client is not responsible for
counting the section and page validations.

The expected schema for this subscription is below.

```graphql
type PageValidation {
  id: ID!
  errorCount: Int!
}

type SectionValidation {
  id: ID!
  errorCount: Int!
}

type QuestionnaireValidation {
  id: ID!
  errorCount: Int!
  sections: [SectionValidation!]!
  pages: [PageValidation!]!
}

type Subscription {
  validationUpdated(id: ID!): QuestionnaireValidation!
}
```

### Client

The app will fetch the initial error count for all pages and sections so we have the correct
starting state. When it receives notification of a validation change then it will use this 
count from then on.

### Server

Mutations on the server will all be wrapped in a consistent method which is responsible for 
re-running the validations after the change has been saved and publishing the notification that the
validations have changed.

Clients will need to be validated on connection so that users without a token cannot listen to a
subscription.

## Consequences

After this change then it will be straight forward for new validations and features to maintain this
validation state.

However subscriptions are stateful and maintain a connection to one of the api nodes. This means if
a mutation happens on node `A` then all clients connected to node `B` will not be able to see this.
To resolve this we will need to use an external [pubsub system which is supported by apollo](https://www.apollographql.com/docs/apollo-server/features/subscriptions/#pubsub-implementations). This has not been investigated in the spike more than proving that the 
issue is present.

Permissions will need to be supported so that we do not provide validation information to users with
valid tokens but do not have editing permissions. This can be done as part of the subscription
filter.
