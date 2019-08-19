// config/database.js
module.exports = {
  "url":`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@housepricinggpscluster-swmzu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
};
