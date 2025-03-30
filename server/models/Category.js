const { Schema, model } = require('mongoose');

const categorySchema = new Schema(
  {
    name: { 
      type: String, 
      required: true, 
    },
    isCustom: { 
      type: Boolean, 
      default: false 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
      },
  },
  { 
    timestamps: true,
    toJSON: { 
        virtuals: true 
    }
}
);

categorySchema.virtual('expenses', {
    ref: 'Expense',    
    localField: '_id',      
    foreignField: 'categoryId', 
    justOne: false,      
  });

categorySchema.virtual('user', {
    ref: 'User',            
    localField: 'userId',     
    foreignField: '_id',      
    justOne: true,         
  });

categorySchema.set('toJSON', { virtuals: true });

const Category = model("Category", categorySchema);

module.exports = Category;