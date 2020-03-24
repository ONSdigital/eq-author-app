Feature: Creating a questionnaire

    Scenario: Questionnaire without an ID
        Given I am a developer attempting to programatically create a new questionnaire within the database
        And I have not assigned an ID to the questionnaire
        When I use the createQuestionnaire method from the Firestore datastore
        Then The method should give my questionnaire a new ID
        And the ID should be a UUID
        And the questionnaire should save within the database