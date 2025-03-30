const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const expenseSchema = new Schema(
    {
        name: { 
            type: String, 
            required: true 
        },
        amount: 
        { 
            type: Number, 
            required: true 
        },
        date: { 
            type: Date, 
            required: true 
        },
        categoryId: { 
            type: Schema.Types.ObjectId, 
            ref: "Category" 
        },
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: "User", 
            required: true 
          },
    }
);

expenseSchema.virtual('category', {
    ref: 'Category',         
    localField: 'categoryId',   
    foreignField: '_id',    
    justOne: true,          
});
  
  // Virtual field to populate the user
expenseSchema.virtual('user', {
    ref: 'User',             
    localField: 'userId',    
    foreignField: '_id',        
    justOne: true,         
});

expenseSchema.set('toJSON', { virtuals: true });

const Expense = model("Expense", expenseSchema);

module.exports = Expense;