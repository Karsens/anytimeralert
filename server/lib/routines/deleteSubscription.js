import { Model } from "../connectors";

const { User } = Model;

const createOrUpdateUser = (_, { name, phone }) =>
  User.findOne({ where: { phone } })
    .then(u => {
      if (u) {
        //send and change auth via sms
      } else {
        //create user and send auth via sms
      }
    })
    .catch(e => console.log(e));

module.exports = createOrUpdateUser;
