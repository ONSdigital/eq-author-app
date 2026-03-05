const {
    getQuestionnaireMetaById,
    saveMetadata,
    getQuestionnaireByVersionId,
} = require("../../../db/datastore");
const {
    authorisedRequest,
} = require("./authorisedRequest");
const { logger } = require("../../../utils/logger");
const { v4: uuidv4 } = require("uuid");

const convertQuestionniare = async (questionnaire, publishResult) => {
    const convertedResponse = await authorisedRequest(
        `${process.env.CONVERSION_URL}`,
        null,
        {
            method: "POST",
            body: JSON.stringify(questionnaire),
            headers: { "Content-Type": "application/json" },
        }
    ).catch((e) => {
        publishResult.success = false;
        publishResult.errorMessage = `Failed to fetch questionnaire - ${e.message}`;
        publishResult.displayErrorMessage = "Publish error, please try later";
        throw new Error(`Failed to fetch questionnaire - ${e.message}`);
    });

    if (convertedResponse.status !== 200) {
        publishResult.success = false;
        publishResult.errorMessage = `Publisher failed to convert questionnaire - ${convertedResponse.statusText}`;
        publishResult.displayErrorMessage = "Contact eQ services team";
        throw new Error(`Publisher failed to convert questionnaire - ${convertedResponse.statusText}`);
    }

    return convertedResponse.data;
}

const validateQuestionnaire = async (convertedQuestionnaire, publishResult) => {
    const validatedResponse = await authorisedRequest(
        `${process.env.VALIDATOR_URL}`,
        null,
        {
            method: "POST",
            body: JSON.stringify(convertedQuestionnaire),
            headers: { "Content-Type": "application/json" },
        }
    ).catch((e) => {
        publishResult.success = false;
        publishResult.errorMessage = `Failed to connect to validator - ${e.message}`;
        publishResult.displayErrorMessage = "Publish error, please try later";
        throw new Error(`Failed to connect to validator - ${e.message}`);
    });

    if (
        validatedResponse.status === 200 &&
        validatedResponse.data.success === false
    ) {
        publishResult.success = false;
        publishResult.errorMessage = `Questionnaire validation failed`;
        publishResult.displayErrorMessage = "Contact eQ services team";
        throw new Error(`Questionnaire validation failed`);
    }

    if (validatedResponse.status !== 200) {
        publishResult.success = false;
        publishResult.errorMessage = `Validator returned non-200 error`;
        publishResult.displayErrorMessage = "Contact eQ services team";
        throw new Error(`Validator returned non-200 error`);
    }
}

const postSchema = async (validatedQuestionnaire, gateway, audience, query, publishResult) => {
    await authorisedRequest(
        `${gateway}publish_collection_instrument?${query}`,
        audience,
        {
            method: "POST",
            body: JSON.stringify(validatedQuestionnaire),
            headers: { "Content-Type": "application/json" },
        }
    )
        .then(async (res) => {
            if (res.status === 200) {
                const responseJson = res.data;
                logger.info(responseJson, "Response from CIR gateway");
                publishResult.cirId = responseJson.guid || null;
                publishResult.cirVersion = responseJson.ci_version || null;
                publishResult.validatorVersion =
                    responseJson.validator_version || null;
                publishResult.success = true;
            } else {
                publishResult.success = false;
                publishResult.errorMessage = `Invalid response from ${gateway} - failed with error code ${res.status}`;
                publishResult.displayErrorMessage = "Contact eQ services team";
                throw new Error(`Invalid response - failed with error code ${res.status}`);
            }
        })
        .catch((e) => {
            publishResult.success = false;
            publishResult.errorMessage = `Failed to publish questionnaire to ${gateway} - ${e.message}`;
            publishResult.displayErrorMessage = "Publish error, please try later";
            throw new Error(`Failed to publish questionnaire - ${e.message}`);
        });
}

const publishSchema = async (ctx) => {
    const publishDate = new Date();
    const publishResult = {
        id: uuidv4(),
        surveyId: ctx.questionnaire.surveyId,
        formType: ctx.questionnaire.formType,
        publishDate,
    };

    const questionnaireMetadata = await getQuestionnaireMetaById(
        ctx.questionnaire.id
    );

    if (questionnaireMetadata.publishHistory) {
        questionnaireMetadata.publishHistory.push(publishResult);
    } else {
        questionnaireMetadata.publishHistory = [publishResult];
    }

    try {
        const convertedQuestionnaire = await convertQuestionniare(
            ctx.questionnaire,
            publishResult
        );
        logger.info(`publish questionnaire with version id ${ctx.questionnaire.questionnaireVersionId}  - converted`);

        await validateQuestionnaire(
            convertedQuestionnaire,
            publishResult
        );
        logger.info(`publish questionnaire with version id ${ctx.questionnaire.questionnaireVersionId}  - validated`);

        await postSchema(
            convertedQuestionnaire,
            process.env.CIR_PUBLISH_SCHEMA_GATEWAY_FIRST,
            process.env.CIR_PUBLISH_SCHEMA_GATEWAY_AUDIENCE_FIRST,
            `guid=${ctx.questionnaire.questionnaireVersionId}&validator_version=0.0.0`,
            publishResult
        );
        logger.info(publishResult, `publish questionnaire with version id ${ctx.questionnaire.questionnaireVersionId}  - posted to first CIR gateway`);

        // post to second gateway if enabled and first gateway publish was successful
        // The ci_vserion is added to the second post to ensure the CI in both environments can be referenced by the same ci version number
        if (process.env.CIR_PUBLISH_SCHEMA_GATEWAY_SECOND !== "nopublish" && publishResult.success) {
            await postSchema(
                convertedQuestionnaire,
                process.env.CIR_PUBLISH_SCHEMA_GATEWAY_SECOND,
                process.env.CIR_PUBLISH_SCHEMA_GATEWAY_AUDIENCE_SECOND,
                `guid=${ctx.questionnaire.questionnaireVersionId}&validator_version=0.0.0&&ci_version=${publishResult.cirVersion}`,
                publishResult
            );
        }
        logger.info(publishResult, `publish questionnaire with version id ${ctx.questionnaire.questionnaireVersionId}  - posted to second CIR gateway`);

        //check CIR id matches the versionId to ensure the correct GUID has been used in CIR, commented out until CIR complete thier work to return the GUID
        /* if(publishResult.cirId !== ctx.questionnaire.questionnaireVersionId) {
            publishResult.success = false;
            publishResult.errorMessage = `CIR gateway did not return expected guid - expected ${ctx.questionnaire.questionnaireVersionId} but got ${publishResult.cirId}`;
            publishResult.displayErrorMessage = "Contact eQ services team";
        } */
    }
    finally {
        if (!publishResult.success) {
            logger.error(publishResult.errorMessage, "Publish failed");
        }
        await saveMetadata(questionnaireMetadata);
        return questionnaireMetadata.publishHistory;
    }

}


const republishSchema = async (questionnaireVersionId, cirVersion) => {
    const publishDate = new Date();
    const publishResult = {
        id: uuidv4(),
        publishDate,
    };

    if (!cirVersion) {
        publishResult.success = false;
        publishResult.errorMessage = `CIR version is required for republish`;
        publishResult.displayErrorMessage = "Republish error, please try later";
        logger.error(publishResult.errorMessage, "Republish failed");
        return publishResult;
    }

    const questionnaire = await getQuestionnaireByVersionId(questionnaireVersionId);

    if (!questionnaire) {
        publishResult.success = false;
        publishResult.errorMessage = `Questionnaire with version id ${questionnaireVersionId} not found`;
        publishResult.displayErrorMessage = "Republish error, please try later";
        logger.error(publishResult.errorMessage, "Republish failed");
        return publishResult;
    }

    publishResult.surveyId = questionnaire.surveyId;
    publishResult.formType = questionnaire.formType;

    const questionnaireMetadata = await getQuestionnaireMetaById(
        questionnaire.id
    );

    if (questionnaireMetadata.publishHistory) {
        questionnaireMetadata.publishHistory.push(publishResult);
    } else {
        questionnaireMetadata.publishHistory = [publishResult];
    }

    try {
        const convertedQuestionnaire = await convertQuestionniare(
            questionnaire,
            publishResult
        );
        logger.info(`republish questionnaire with version id ${questionnaire.questionnaireVersionId}  - converted`);

        await validateQuestionnaire(
            convertedQuestionnaire,
            publishResult
        );
        logger.info(`republish questionnaire with version id ${questionnaire.questionnaireVersionId}  - validated`);

        await postSchema(
            convertedQuestionnaire,
            process.env.CIR_PUBLISH_SCHEMA_GATEWAY_FIRST,
            process.env.CIR_PUBLISH_SCHEMA_GATEWAY_AUDIENCE_FIRST,
            `guid=${questionnaire.questionnaireVersionId}&validator_version=0.0.0&&ci_version=${cirVersion}`,
            publishResult
        );
        logger.info(publishResult, `republish questionnaire with version id ${questionnaire.questionnaireVersionId}  - posted to first CIR gateway`);

        if (process.env.CIR_PUBLISH_SCHEMA_GATEWAY_SECOND !== "nopublish" && publishResult.success) {
            await postSchema(
                convertedQuestionnaire,
                process.env.CIR_PUBLISH_SCHEMA_GATEWAY_SECOND,
                process.env.CIR_PUBLISH_SCHEMA_GATEWAY_AUDIENCE_SECOND,
                `guid=${questionnaire.questionnaireVersionId}&validator_version=0.0.0&&ci_version=${cirVersion}`,
                publishResult
            );
        }
        logger.info(publishResult, `republish questionnaire with version id ${questionnaire.questionnaireVersionId}  - posted to second CIR gateway`);
    }
    finally {        
        if (!publishResult.success) {
            logger.error(publishResult.errorMessage, "Republish failed");
        }
        await saveMetadata(questionnaireMetadata);
        return publishResult
    }

}

module.exports = {
    publishSchema,
    republishSchema
};
