# 3. Author validation

Date: 2019-03-12

## Status

Accepted

## Context

Currently users are provided with very little useful feedback as to any errors in the questionnaire
they are building. This change aims to provide a way for the users to see feedback on the changes
they are making by exposing the validation errors to them.

There are multiple types of validations:
- Intra-entity. These are validations on fields within an entity itself e.g. a question page must
have a populated title.
- Inter-entity validations. These are validations across entities. e.g. an answer validation that
references an answer can only reference a previous answer.

## Decision

We intend to validate a questionnaire on the API and provide graphql types to expose the validation
result to the UI.

### 1. Use JSON schema with ajv
#### JSON Schema
We chose JSON schema as the format for defining the requirements for each field.
1. We store our questionnaires as JSON so it requires no transformation
1. It is [well understood](https://github.com/ONSdigital/eq-schema-validator) with the department.
1. It can also be used as documentation to the data types that exist within an author questionnaire.

#### AJV
Given that we are using JSON schema we needed to find an appropriate library for interpreting and 
running the schemas. During the 
[investigation spike](https://github.com/ONSdigital/eq-author-app/tree/spike-valdation-json-schema)
we found [AJV](https://ajv.js.org/) to be a good choice. For most requests it was extremely fast and
could validate our empty survey in <0.1ms. For larger surveys (e.g. ASHE and QPSES) AJV was capable 
of validating them in less than 3ms for all requests and <1ms 90% of the time. 

Once the schema was defined then using it with AJV was straight forward as the API was clearly 
documented. 

In the spike it was also possible to extend AJV to add custom validation to provide inter-entity 
validations through a [custom keyword](https://ajv.js.org/custom.html). So it is possible to not
require any additional passes of the questionnaire as required in schema validator.

Additionally AJV is an active project that is keeping up to date with JSON schema version changes
so as more functionality is added we expect AJV to track those changes and implement when they are
released.

### 2. Validate a questionnaire on every request
During the investigation it was found that only completely improbable extreme cases could cause
validation to run slowly (>10ms). So to make retrieving data in resolvers easier we implemented the
validation as express middleware so it would for every graphql request. This we appreciate is not
necessarily optimal but is very simple so will work for this initial version. If validation starts
becoming slower then we can investigate other options including: persisting/caching validations
after every write or, running validate in the resolvers when we are guaranteed to need them.

### 3. Re-validate the questionnaire after every mutation
The validation errors can change afer a mutation so we need to update the errors held in the context
once this has happened so that the result being read on the response of the mutation contain the
correct validation errors.

### 4. Provide the validation errors at the entiy level
All entities will have a validation errors array field in their graphql type which will contain a 
list of all the errors. Each error will contain:
- location - The field/property name that has the error
- errorCode - The code representing the type of error

## Consequences

After this change we will be able to provide all the data that the UI will need to be able to show
the errors that exist within the questionnaire. 

It is the UIs responsibilty about how the errors are used and there is significant complexity around
when these errors are shown/hidden. This has been dealt with by a prototypes by @hamishtaplin
