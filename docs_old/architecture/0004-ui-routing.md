# 4. UI Routing

Date: 2019-03-06

## Status

Accepted

## Context

Currrently the routing in the UI is both complex and very inflexible. This causes a number of issues
every time a new page type is added.

### Current format
The current complete route format is defined as
```
/questionnaire/:questionnaireId/:sectionId?/:pageId?/:confirmationId?/:tab
```
The regular expressions defining each of the optional ids is the same if the app received the URL
`/questionnaire/1/2/design`. Then `1` is always interpreted as a `questionnaireId` and `2` is always
interpreted as a `sectionId` even if they weren't. So, for a page to be found a section must always
be provided so for the URL `/questionnaire/1/2/3/design`, `3` would be interpreted as a pageId.

### URL controlling layout
We render different components based on which URL is encountered. Currently controls:
1. The main editor layout (combination of the final id and tab)
1. The properties panel (combination of the final id and tab)
1. Which tab is highlighted (the whole URL must match)
1. Which option in the left hand panel to highlight (the whole URL must match)

### Centralised URL management
Currently all URL structures are defined in one grand URL and managed through
`eq-author/src/utils/UrlUtils.js`. This file is both complex and changes here can have lots of
unintended consequences.

### URL used by all requests
The URL is parsed at request time to generate a header that is sent with every request to the server
this header is called `questionnaireId` and is used to determine which questionnaire to load and
change or read from for the request.

### Route definition
Currently the route is only defined in `eq-author/src/App/QuestionnaireDesignPage/index.js` which
includes routes for lots of entity types and their tabs which is very confusing. The component also
has a lot of other logic in it for controlling the left hand navigation.

### Issues
1. It is impossible to add new entity types. If you wanted to add a new entity that does not sit
within a section (e.g. survey introduction) then there is no way for the current URL format to
support this.
1. Generating the correct URL for the left hand panel requires the URL to maintain the tab if the
entity supports the tab location. This is complex and error prone and currently does not always work
as intended e.g. navigating from page routing to a section always to take you the first section.
1. After the switch to generating UUIDs for the ids of entities the current structure for pages
results in long and complex urls e.g. `/questionnaire/95bb38ae-daf1-49c4-93fc-a87edeee7733/afee8bd0-042b-4350-aaa1-775ac760a0b6/f8e62d4a-2798-4524-ad39-57ca9ae5166a/design`

## Decision

### 1. New URL format
The URL format will become `/q/:questionnaireId:/:entityType/:entityId/:tab`. This means
that is can easily be changed for new entity types.

| Entity Type | Example design URL |
|---|---|
| Section  | `/q/1/section/1/design`  |
| Page  | `/q/1/page/1/design`  |
| Question confirmation  | `/q/1/question-confirmation/1/design`  |
| Survey introduction  | `/q/1/introduction/1/design`  |

## Consequences

### 1. New URL format
- The request middleware to set the questionnaireId header will still work.
- Adding new entities becomes possible and the extension point is more obvious.
- Need to refactor everywhere in the app that is relying on having the parent id availble in the URL
to get them to request it from graphql instead.
- Old bookmarks are broken. We could mitigate this with redirect rules from the old format to the
new format.
