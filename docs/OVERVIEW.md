# Overview

## Publisher

The conversion between the GraphQL JSON output and the EQ runner schema can be thought of as a pipeline.

The conversion pipeline is made up of a series of steps to convert each part of the GraphQL JSON.

Each step applies a series of transforms to manipulate the resulting JSON.  

The final validate process is passed on to [eq-schema-validator](https://github.com/ONSdigital/eq-schema-validator)

![process.jpg](/eq-publisher/docs/images/process.png)
