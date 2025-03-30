const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { User, Expense, Category } = require("../models");
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

          getExpensesByCategory: async (parent, { categoryId }) => {
            try {
              const expenses = await Expense.find({ categoryId })
                .populate('category') 
                .populate('user');     
      
              return expenses;
            } catch (err) {
              console.error("Error fetching expenses by category:", err);
              throw new Error("Failed to fetch expenses by category.");
            }
        },

        getAllExpensesByUser: async (parent, { userId }, context) =>{
          try {
            const user = await User.findById(userId);
            if (!user) {
              throw new AuthenticationError('User not found');
            }

            const allExpenses = await Expense.find({ userId })
            .populate('category')

            return allExpenses

          }
          catch(error) {
            console.error(error)
            throw new Error("Failed to fetch expenses by user.");
          }
        }
        
    },
    Mutation: {
      login: async (parent, { email, password }, context) => {
        try {
          const user = await User.findOne({ email })
  
          if (!user) {
            throw new ApolloError(
              "User not found, please register",
              "USER_NOT_FOUND"
            );
          }
  
          const isCorrectPassword = await user.isCorrectPassword(password);
          if (!isCorrectPassword) {
            throw new ApolloError(
              "Incorrect password"
            );
          }
  
          const token = signToken(user);
          // console.log("token on login:", JSON.stringify(token));
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
              "Email already in use"
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
                },
              },
              { new: true }
            );
            return updateUser;
          } catch (error) {
            console.error("Update user error:", error);
            throw new ApolloError(
              "Error updating user details",
            );
          }
        }
        throw new AuthenticationError("You must be logged in!");
      },

      addExpense: async(parent, { name, amount, date, categoryId, userId }, context) => {
        try {
          // Check if the user exists and category exists
          const user = await User.findById(userId);
          if (!user) {
            throw new AuthenticationError('User not found');
          }
      
          const category = await Category.findById(categoryId);
          if (!category) {
            throw new Error('Category not found');
          }
      
          const expense = new Expense({
            name,
            amount,
            date: new Date(date), 
            categoryId,
            userId,
          });
      
          const savedExpense = await expense.save();
      
          const populatedExpense = await Expense.findById(savedExpense._id).populate('category').populate('user');  
      
          return populatedExpense;
        } catch (error) {
          console.error('Error creating expense:', error);
          throw new Error('Failed to create expense');
        }
      },

      addCategory: async (_, { name, isCustom, userId }) => {
        try {
          const newCategory = new Category({
            name,
            isCustom,
            userId,
          });
  
          await newCategory.save();
          return newCategory;
        } catch (error) {
          throw new Error(error);
        }
      },
    },
  
  };
  
  module.exports = resolvers;