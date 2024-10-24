/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */

const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' });
  // 24PW PRD credentials
  const captchaSecret = '6LdpPxIqAAAAAOBI1_Bj5BJUv5luwoMBGM06WtsL';

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action');

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.error(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = [
      'chipNumber',
      'petName',
      'reportDate',
      'street',
      'city',
      'state',
      'country',
      'reporterName',
      'reporterPhone',
      'reporterEmail',
      'partnerID',
      'isFound',
      'token',
    ];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    const {
      chipNumber,
      petName,
      reportDate,
      street,
      city,
      state,
      country,
      reporterName,
      reporterPhone,
      reporterEmail,
      notes,
      partnerID,
      isFound,
      reportSystemName,
      reporterPhoneAlt,
      recoveryCaseId,
      reportedBy,
      contactConsent,
      reporterIp,
      resolution,
      internalViewOnly,
      enterbyOrgnizationId,
      enterByUserName,
      token,
    } = params;

    // TODO: Remove payload object once the approach is approved
    // Wrapping the body in another object with payload key to match the expected format of the final endpoint
    const body = {
      payload: {
        chipNumber,
        petName,
        reportDate,
        street,
        city,
        state,
        country,
        reporterName,
        reporterPhone,
        reporterEmail,
        notes,
        partnerID,
        isFound,
        reportSystemName,
        reporterPhoneAlt,
        recoveryCaseId,
        reportedBy,
        contactConsent,
        reporterIp,
        resolution,
        internalViewOnly,
        enterbyOrgnizationId,
        enterByUserName,
      }
    };

    logger.info('TEMP: final request body !!!:', JSON.stringify(body))

    // Validate Captcha
    const captchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: captchaSecret, response: token }),
    });
    const data = await captchaResponse.json();
    logger.debug('reCAPTCHA response:', data);

    if (!captchaResponse.ok || !data.success) {
      return errorResponse(400, 'Captcha Invalid', logger);
    }

    params.payload = body.payload;
    params.__ow_path = '/Report/LostPet/SubmitReport'

    return params;

  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, 'server error', logger);
  }
}

exports.main = main
