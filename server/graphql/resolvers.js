const { withFilter } = require("apollo-server-express");
const AuthController = require("../controllers/AuthController");
const RoomController = require("../controllers/RoomController");
const UserController = require("../controllers/UserController");

const { NEW_MESSAGE } = require("../constants");
const useAuth = require("../utils/useAuth");

const resolvers = {
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (parent, args, context) => {
          return context.pubsub.asyncIterator([NEW_MESSAGE]);
        },
        (payload, variables) => {
          return payload.newMessage.roomId.toString() === variables.roomId;
        }
      ),
    },
  },
  Query: {
    me: UserController.me,
    listUsers: useAuth(UserController.listUsers),
    getUser: useAuth(UserController.getUser),
    listRooms: useAuth(RoomController.listRooms),
    getRoom: useAuth(RoomController.getRoom),
  },
  Mutation: {
    signup: AuthController.signup,
    login: AuthController.login,
    createRoom: useAuth(RoomController.createRoom),
    addMembersToRoom: useAuth(RoomController.addMembersToRoom),
    sendMessage: useAuth(UserController.sendMessage),
  },
};

module.exports = resolvers;
