const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { User } = require("../models");
const { model } = require('mongoose');
const { signToken } = require("../utils/auth");

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
              try {
                const userData = await User.findOne({ _id: context.user._id }).select(
                  "-__v -password"
                );
                return userData;
              } catch (error) {
                console.log(error);
              }
            }
            throw new AuthenticationError("You need to be logged in");
          },
          getUserProfile: async (parent, { userId }, context) => {
            try {
              const userProfile = await User.findById(userId);
              if (!userProfile) {
                console.log("User not found");
              }
              return userProfile;
            } catch (error) {}
          },
    },
    Mutation: {
      login: async (parent, { email, password }, context) => {
        try {
          const user = await User.findOne({ email })
  
          if (!user) {
            throw new ApolloError(
              "User not found, please register",
              "NO_USER_FOUND_ERROR"
            );
          }
  
          const isCorrectPassword = await user.isCorrectPassword(password);
          if (!isCorrectPassword) {
            throw new ApolloError(
              "Incorrect password",
              "INCORRECT_PASSWORD_ERROR"
            );
          }
  
          const token = signToken(user);
          console.log("token on login:", JSON.stringify(token));
          console.log("Logged in");
          return { token, user };
        } catch (error) {
          console.error("Error during login:", error);
          throw error;
        }
      },

      register: async (parent, { userData, password }) => {

        try {
          const existingEmail = await User.findOne({ email: userData.email });
  
          if (existingEmail) {
            console.log("Email already in use");
            throw new ApolloError(
              "Email already in use",
              "DUPLICATE_EMAIL_ERROR"
            );
          }
  
          const newUser = await User.create({
            ...userData,
            password: password,
          });
          console.log(userData)
          const token = signToken(newUser);
          
  
          console.log("token:", JSON.stringify(token));
          return { token: token, user: newUser };
        } catch (error) {
          console.log(error);
          // console.log(userData)
          throw error;
        }
      },

      updateUser: async (parent, { userData }, context) => {
        if (context.user) {
          console.log("this is the user", context.user._id);
          try {
            const updateUser = await User.findByIdAndUpdate(
              { _id: context.user._id },
              {
                $set: {
                  first_name: userData.first_name,
                  last_name: userData.last_name,
                  username: userData.username,
                  email: userData.email,
                  profile: userData?.profile || "",
                },
              },
              { new: true }
            );
            return updateUser;
          } catch (error) {
            console.error("Update user error:", error);
            throw new ApolloError(
              "Failed to update user details",
              "USER_UPDATE_ERROR"
            );
          }
        }
        throw new AuthenticationError("You must be logged in!");
      },
    },
  };
  
  module.exports = resolvers;