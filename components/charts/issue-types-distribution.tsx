"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Mock data for issue types distribution
const data = [
  { name: "Bug", value: 35, color: "#ff6b6b" },
  { name: "Feature", value: 45, color: "#4ecdc4" },
  { name: "Task", value: 30, color: "#ffe66d" },
  { name: "Epic", value: 15, color: "#1a535c" },
  { name: "Story", value: 25, color: "#ff9f1c" },
]

const COLORS = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#1a535c", "#ff9f1c"]

export default function IssueTypesDistribution() {
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

