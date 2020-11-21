const {User} = require('./mongodb');
const bcrypt = require('bcrypt');
const logger = require('./serverlog/logger');

async function createUser() {
try {
  const roles = {
    ADMIN: "Admin"
  }
  const user = {
    username: "Andreas",
    password: await bcrypt.hash("4556@A89xy$$", 10),
    role: roles.ADMIN
  }
  logger.info(`Create user: ${JSON.stringify(user)}`);
  User.create(user);
  return "Successful created user: " + user.username;
} catch (e){
  return new Error(`Create user failed: ${e}`)
}
}
module.exports = {
  createUser
}
