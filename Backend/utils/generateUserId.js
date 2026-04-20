const User = require("../models/User");

const generateUserId = async () => {
  const lastUser = await User.findOne().sort({ _id: -1 });
  if (!lastUser || !lastUser.userId) {
    return "U1";
  }
  const lastUserId = parseInt(lastUser.userId.slice(1), 10);
  return `U${lastUserId + 1}`;
};

module.exports = generateUserId;
