const bcrypt = require('bcrypt');

async function encodeUser(user) {
  const hash = await bcrypt.hash(user.password, 10);
  user.password = hash; // User's password has been encoded.
}

module.exports = {
  encodeUser,
};
