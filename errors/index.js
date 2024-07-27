//to export everything
const CustomAPIError = require('./custom-api');
const UnauthenticatedError = require('./unauthenticated');
const UnauthorizedError = require('./unauthorized');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
const ErrorGeneratingReport = require('./error-report');


module.exports = {
  CustomAPIError,
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  ErrorGeneratingReport,

  
};
