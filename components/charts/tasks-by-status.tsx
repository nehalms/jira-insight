"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "To Do", value: 45, color: "#8884d8" },
  { name: "In Progress", value: 30, color: "#83a6ed" },
  { name: "In Review", value: 15, color: "#8dd1e1" },
  { name: "Done", value: 60, color: "#82ca9d" },
]

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"]

export default function TasksByStatus() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

