# Routing E2E Test

This test spec file was created as part of the setup work for the routing refactor. It is designed to create a simple survey that utilizes all
features offered by the current routing implementation. This test runs across the entire EQ structure and asserts that the route is correct
by following it though on EQ-Survey-Runner.

The layout of the survey is as follows:

```
                                   +-------------------+
                                   | Section 1. Page 1 |
                                   +----------+--------+
                                   |          |        |
           Chose A                 |          |        |                         Chose B
           +-----------------------+          |        +--------------------------------+
           |                           Not Answered                                     |
           |                                  |                                         |
           v                                  v                                         v

+-----------------+                 +-----------------+                       +--------------------+
|Section 1. Page 4| <-------+       |Section 1. Page 2|          +----------> |End of Questionnaire|
+----------+------+         |    +-----------------------+       |            +----------+---------+
           |                +----+ Question Confirmation +-------+                       ^
           |               < 5   +-----------------------+     > 5                       |
           |                                                                             |
           |                                                                             |
           v                                                                             |
                                                                                         |
+----------------+                                                                       |
|Section 2 Page 1+-----------------------------------------------------------------------+
+----------------+
```

### Set up of the services required

This test requires the following services and env vars:  
EQ-Author - REACT_APP_FUNCTIONAL_TEST="true"  
EQ-Author-Api - RUNNER_SESSION_URL="http://localhost:5000/session?token="  
EQ-Publisher

EQ-Survey-Runner - This and all related services can be spun up using the docker-compose file located in the Runner repo.

Once all these services are running the test can be started using: yarn cypress:open:routing
