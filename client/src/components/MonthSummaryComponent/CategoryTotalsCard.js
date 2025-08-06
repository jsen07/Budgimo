import React from "react";
import categoryIcons from "../../presets/categoryIcons";

const CategoryTotalsCard = ({ title, income, expense, net }) => {
  const icon = categoryIcons.find((icon) => icon.name === title)?.icon;

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 transition hover:shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <div className="flex items-center justify-center p-2 rounded-lg bg-neutral-800">
            {icon}
          </div>
        )}
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Income</span>
          <span className="text-green-600 font-semibold">{income}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Expense</span>
          <span className="text-red-600 font-semibold">{expense}</span>
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-3">
          <span className="text-gray-700 font-medium">Net</span>
          <span
            className={`font-semibold ${
              net >= 0 ? "text-green-700" : "text-red-700"
            }`}
          >
            {net}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CategoryTotalsCard;
