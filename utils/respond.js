const constructResponse = (status, message) => ({
  success: status,
  message: message
});

module.exports = {
  dbops: (res, response) => {
    if (response === 'duplicate') {
      res.status(403).send(constructResponse(false, 'User already exists'));
    } else if (response === 'success') {
      res.send(constructResponse(true, 'User provisioned successfully'));
    } else if (response === 'internal error') {
      res.status(503).send(constructResponse(false, 'Database Error'));
    } else if (response === 'invalid') {
      res.status(400).send(constructResponse(false, 'Bad Request'));
    }
  },
  success: (res, message) => res.send(constructResponse(true, message)),
  internalError: res =>
    res.send
      .status(503)
      .send(constructResponse(false, 'Internal server error occurred')),
  invalidJSON: res =>
    res.send
      .status(400)
      .send(constructResponse(false, 'Invalid JSON in the request'))
};
