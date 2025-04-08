const { AuthenticationError, ApolloError } = require("apollo-server-express");
const { User, Expense, Category, Month } = require("../models");
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
        const user = await User.findById(userId);
        if (!user) {
          throw new AuthenticationError("User not found");
        }

        const sortOptions =
          orderBy === "date_DESC" ? { date: -1 } : { date: 1 };

        const expensesQuery = Expense.find({ userId })
          .populate("category")
          .sort(sortOptions);

        if (limit) {
          expensesQuery.limit(limit);
        }
        const allExpenses = await expensesQuery;

        return allExpenses;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch expenses by user.");
      }
    },

    getAllCategoriesByUser: async (parent, { userId }, context) => {
      try {
        const categoryQuery = Category.find({ userId });

        return categoryQuery;
      } catch (error) {
        throw new Error("Failed to fetch expenses by user.");
      }
    },

    getMonthsByUser: async (parent, { userId }, context) => {
      try {
        const getMonthsQuery = Month.find({ userId });

        return getMonthsQuery;
      } catch (error) {
        throw new Error("Failed to fetch months by user.");
      }
    },

    getExpensesByMonth: async (parent, { monthId }, context) => {
      try {
        const expenses = await Expense.find({ monthId }).populate("category");

        return expenses;
      } catch (err) {
        console.error("Error fetching expenses by month:", err);
        throw new Error("Failed to fetch expenses by month.");
      }
    },

    getClosestMonth: async (_, { userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) return null;

        const months = await Month.find({ userId }).populate({
          path: "expenses",
          populate: {
            path: "category",
            model: "Category",
          },
        });

        if (months.length === 0) return null;

        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;

        let closestMonth = null;
        let closestDiff = Infinity;

        for (const month of months) {
          const [mm, yyyy] = month.month.split("-");
          const monthYear = Number(yyyy) * 12 + Number(mm);
          const currentDate = currentYear * 12 + currentMonth;
          const diff = Math.abs(monthYear - currentDate);

          if (diff < closestDiff) {
            closestDiff = diff;
            closestMonth = month;
          }
        }

        if (!closestMonth) return null;

        const [mm, yyyy] = closestMonth.month.split("-");
        const formattedMonth = `${String(mm).padStart(2, "0")}-${yyyy}`;

        return {
          id: closestMonth._id.toString(),
          month: formattedMonth,
          budget: closestMonth.budget,
          balance: closestMonth.balance,
          expenses: closestMonth.expenses,
        };
      } catch (error) {
        console.error(error);
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

    addMonth: async (parent, { month, budget, userId }) => {
      try {
        const user = await User.findById(userId);
        if (!user) throw new Error("User not found");

        const monthRegex = /^(0[1-9]|1[0-2])-\d{4}$/;
        if (!monthRegex.test(month)) {
          throw new Error("Invalid month format. Please use MM-YYYY.");
        }

        const existingMonth = await Month.findOne({ user: userId, month });
        if (existingMonth) {
          throw new Error("This month already exists for the user.");
        }

        const newMonth = new Month({ month, budget, userId, balance: budget });
        await newMonth.save();

        return newMonth;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    addExpense: async (
      parent,
      { name, amount, date, moneyOut, categoryId, userId, monthId },
      context
    ) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new AuthenticationError("User not found");
        }

        const category = await Category.findById(categoryId);
        if (!category) {
          throw new ApolloError("Category not found", "CATEGORY_NOT_FOUND");
        }

        const month = await Month.findById(monthId);
        if (!month) {
          throw new ApolloError("Month not found", "MONTH_NOT_FOUND");
        }

        let parseAmount = parseFloat(amount);

        const updatedMonth = await Month.findByIdAndUpdate(
          monthId,
          {
            $inc: {
              balance: moneyOut
                ? -parseFloat(parseAmount.toFixed(2))
                : +parseFloat(parseAmount.toFixed(2)),
            },
          },
          { new: true }
        );

        if (!updatedMonth) {
          throw new ApolloError("Month not found", "MONTH_NOT_FOUND");
        }

        const expense = new Expense({
          name,
          amount,
          moneyOut,
          date,
          categoryId,
          userId,
          monthId,
        });

        const savedExpense = await expense.save();
        if (!savedExpense) {
          throw new ApolloError("Failed to save expense", "SAVE_FAILED");
        }

        const populatedExpense = await Expense.findById(savedExpense._id)
          .populate("category")
          .populate("user")
          .populate("month");

        return populatedExpense;
      } catch (error) {
        console.error("Error in addExpense mutation:", error);
        throw new ApolloError("Failed to add expense", "ADD_EXPENSE_FAILED");
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
