const loadDigest = require('../digest')

module.exports = function(app){

  if (process.env.NODE_ENV === 'development') {

    app.use((request, response, next) => {
      loadDigest()
        .then(digest => {
          response.digest = digest
          Object.assign(response.locals, digest)
        })
        .then(next)
        .catch(next)
    })

    app.get('/digest', (request, response, next) => {
      response.json(response.digest)
    })


  }else{

    let digest;

    app.use((request, response, next) => {
      response.digest = digest
      next()
    })

    loadDigest()
      .then(_digest => {
        digest = _digest
        Object.assign(app.locals, digest)
      })
      .catch(error => {
        console.error(error)
        process.exit(1)
      })
  }
}
