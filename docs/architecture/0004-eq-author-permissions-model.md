# 4. EQ Author Permissions Model

Date: 2019-03-11

## Status

Accepted

## Context

As part of the work to move Author into a production environment, in order to do that we have business requirements to fulfil around that to introduce controls around who can view and modify questionnaires in the system. Currently this is not locked down in any way, leading to undesired consequences, people can overwrite someone else's work and there's no clear audit trail at the moment about who made the change and what change was made.

We need to solve these problems, and the simplest way we can begin to solve some of these problems is to introduce permissions based model to Author.

## Decision

We're proposing to implement a permissions model for Author with the following design.

### Querying a questionnaire

There are two parts to consider with this:

1. Who has access to see the questionnaire.
1. Who has access to make changes to a questionnaire.

When the user logs in:

1. Get the current user Id from the token.
1. Loop through the questionnaire list.
1. For each questionnaire check that the user has questionnaire read permission by looking it up in questionnaire list table.
1. At this point we have a couple of options that we are still deciding on:
   1. Show the questionnaire in the list if the user has read permissions, if the user doesn't have read permissions do not show questionnaire in the list and restrict them from being able to load the questionnaire.
   1. Provide the users a way of filtering the questionnaire list based on their permissions to be able to see their own questionnaires easily. The users would still be able to see questionnaires they dont have access to but have no way of accessing them.
1. On loading a questionnaire if the user has write access allow them to make changes and save those changes to the questionnaire, if not only allow them to load the questionnaire but not make any changes.

We plan to introduce read and write access for questionniare owners (people who created the questionnaire) initially and then encourage the owners to add read/write permissions to their questionniares for people who need to have it.

As part of this initial change we will not be considering implementing a group permissions model but this will be something we will look to do in the future when we have more information around user needs and Group/Role/Team membership. We will also in future be looking to introduce auditing to keep track of changes between versions of questionnaires.

### Data tables

#### Users

List of users

| ID   | User Name |
| ---- | --------- |
| 1111 | User1     |
| 2222 | User2     |

<br>

#### Questionnaire List

List of questionnaires

| ID  | Title | CreatedAt     | UpdatedAt     | Createdby | Readlist     | Writelist    |
| --- | ----- | ------------- | ------------- | --------- | ------------ | ------------ |
| 1   | OPN   | 1532563200000 | 1532563200000 | User1     | [1111, 2222] | [1111, 2222] |
| 2   | UKIS  | 1532563200000 | 1532563200000 | User2     | [1111, 2222] | [1111, 2222] |

<br>

## Consequences

Only a minor risk, because we would initially need to give everyone read and write permissions to all questionnaires to in order to maintain the current experience for the users, this could be considered a risk. We would then allow the users to decide for themselves who should have access and encourage them to limit the permisions only to the people who need it, so this would be quickly mitigated.
