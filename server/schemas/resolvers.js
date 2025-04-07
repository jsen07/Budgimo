const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { User, Expense, Category } = require("../models");
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
          throw new Error("Failed to fetch User.");
        }
        return userProfile;
      } catch (error) {
        throw new Error(error);
      }
    },

    getExpensesByCategory: async (parent, { categoryId }) => {
      try {
        const expenses = await Expense.find({ categoryId })
          .populate("category")
          .populate("user");

        return expenses;
      } catch (err) {
        console.error("Error fetching expenses by category:", err);
        throw new Error("Failed to fetch expenses by category.");
      }
    },

    getAllExpensesByUser: async (
      parent,
      { userId, limit, orderBy },
      context
    ) => {
      try {
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
          throw new AuthenticationError("User not found");
        }

        // Set sorting options based on the `orderBy` argument
        const sortOptions =
          orderBy === "date_DESC" ? { date: -1 } : { date: 1 }; // Default to ascending if no "date_DESC"

        // If a limit is passed, apply it, otherwise, return all expenses
        const expensesQuery = Expense.find({ userId })
          .populate("category")
          .sort(sortOptions); // Sorting by date

        // Apply limit if provided
        if (limit) {
          expensesQuery.limit(limit); // Limit the number of results if a limit is specified
        }

        // Fetch expenses from the database
        const allExpenses = await expensesQuery;

        return allExpenses;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch expenses by user.");
      }
    },
  },
  Mutation: {
    login: async (parent, { email, password }, context) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new ApolloError(
            "User not found, please register",
            "USER_NOT_FOUND"
          );
        }

        const isCorrectPassword = await user.isCorrectPassword(password);
        if (!isCorrectPassword) {
          throw new ApolloError("Incorrect password");
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
          throw new ApolloError(
            (err = "Sorry! This e-mail is already in use."),
            "EMAIL_IN_USE"
          );
        }

        const newUser = await User.create({
          ...userData,
          password: password,
        });
        const token = signToken(newUser);

        console.log("token:", JSON.stringify(token));
        return { token: token, user: newUser };
      } catch (error) {
        console.log("Registration error:", error);
        const existingEmail = await User.findOne({ email: userData.email });

        if (existingEmail) {
          throw new ApolloError(
            (err = "Sorry! This e-mail is already in use."),
            "EMAIL_IN_USE"
          );
        } else {
          throw new ApolloError(
            "Oops! Something went wrong, please try again!"
          );
        }
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
          throw new ApolloError("Error updating user details");
        }
      }
      throw new AuthenticationError("You must be logged in!");
    },

    addExpense: async (
      parent,
      { name, amount, date, categoryId, userId },
      context
    ) => {
      try {
        // Check if the user exists and category exists
        const user = await User.findById(userId);
        if (!user) {
          throw new AuthenticationError("User not found");
        }

        const category = await Category.findById(categoryId);
        if (!category) {
          throw new ApolloError("Category not found");
        }

        const formatDate = new Date(date);
        const yearMonth =
          formatDate.getFullYear() +
          "-" +
          (formatDate.getMonth() + 1).toString().padStart(2, "0");

        const expense = new Expense({
          name,
          amount,
          date: formatDate,
          categoryId,
          userId,
          month: yearMonth,
        });

        const savedExpense = await expense.save();

        const populatedExpense = await Expense.findById(savedExpense._id)
          .populate("category")
          .populate("user");

        return populatedExpense;
      } catch (error) {
        throw new ApolloError("Failed to add expense");
      }
    },

    addCategory: async (parent, { name, isCustom, userId }) => {
      try {
        const newCategory = new Category({
          name,
          isCustom,
          userId,
        });

        await newCategory.save();
        return newCategory;
      } catch (error) {
        throw new ApolloError("Failed to add category");
      }
    },

    editCategory: async (parent, { id, name }) => {
      try {
        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          { name },
          { new: true }
        );

        if (!updatedCategory) {
          throw new Error("Category not found");
        }

        return updatedCategory;
      } catch (error) {
        throw new ApolloError("Failed to edit category");
      }
    },

    deleteCategory: async (parent, { id }) => {
      try {
        const categoryToDelete = await Category.findById(id);

        if (!categoryToDelete) {
          throw new Error("Category not found");
        }

        //delete expenses inside category and delete category after
        const deleteExpenses = await Expense.deleteMany({ categoryId: id });
        const deleteCategory = await Category.deleteOne({ _id: id });

        return {
          success: true,
          message: "Category and related expenses deleted successfully",
          deletedCategoryId: categoryToDelete.id,
        };
      } catch (error) {
        throw new ApolloError("Failed to delete category");
      }
    },

    editExpense: async (parent, { id, userData }, context) => {
      try {
        if (userData.date) {
          const expenseDate = new Date(userData.date);
          userData.month =
            expenseDate.getFullYear() +
            "-" +
            (expenseDate.getMonth() + 1).toString().padStart(2, "0");
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
          id,
          { $set: userData },
          { new: true }
        );

        if (!updatedExpense) {
          throw new Error("Expense not found");
        }

        return updatedExpense;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    deleteExpense: async (parent, { id }, context) => {
      try {
        const deleteExpense = await Expense.findByIdAndDelete(id);

        return deleteExpense;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = resolvers;
