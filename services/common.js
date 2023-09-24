const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

//! cokkie extractor function

exports.cookieExtractor = (req) => {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGFhMzczMmIzNTI2ZmMyN2M4ZGY0OCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY5NTI2OTYyNX0.2Jq1dcqjY2I9gjcW7AOUq1N6l8TRRa6QSJ28VIesXqE";
  return token;
};
