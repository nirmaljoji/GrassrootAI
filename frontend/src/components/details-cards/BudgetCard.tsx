import React from 'react';
import { Wallet, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// Add this budget data
const budgetData = [
  { name: 'Venue Rental', value: 15000, color: '#0088FE' },
  { name: 'Catering', value: 8000, color: '#00C49F' },
  { name: 'Marketing', value: 5000, color: '#FFBB28' },
  { name: 'Equipment', value: 4000, color: '#FF8042' },
  { name: 'Staff', value: 3000, color: '#8884d8' },
  { name: 'Miscellaneous', value: 2000, color: '#82ca9d' },
];

const BudgetCard = () => {
  return (
    <AccordionItem value="budget" className="border rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden z-10">
      <Card className="p-0">
        <AccordionTrigger className="px-6 py-4 hover:no-underline">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-emerald-600" />
            <h2 className="text-xl font-semibold">Budgeting</h2>
          </div>
        </AccordionTrigger>
        <AccordionContent className="px-6 pb-4">
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-700">Budget Overview</h3>
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">
                  Total: ${budgetData.reduce((acc, item) => acc + item.value, 0).toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-4">
              {/* Pie Chart */}
              <div className="h-[300px] border rounded-lg p-4 bg-white shadow-sm">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {budgetData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => `$${value.toLocaleString()}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Cost Breakdown */}
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Cost Breakdown</h4>
                <div className="space-y-3">
                  {budgetData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">
                        ${item.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </AccordionContent>
      </Card>
    </AccordionItem>
  );
};

export default BudgetCard; 