const verifyToken = (request, response, next) => {
  const bearerHeader = request.headers['authorization']

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')  //split at the space
    const bearerToken = bearer[1]
    request.token = bearerToken
    response.send(bearerToken)  ////Just check

    next()
  } else {
    response.status(401).send({
      message: 'Forbidden'
    })
  }
}

module.exports = { verifyToken }