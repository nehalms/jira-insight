"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Alex", completed: 12, inProgress: 3, todo: 5 },
  { name: "Taylor", completed: 18, inProgress: 4, todo: 2 },
  { name: "Jordan", completed: 15, inProgress: 6, todo: 3 },
  { name: "Casey", completed: 20, inProgress: 2, todo: 4 },
  { name: "Morgan", completed: 14, inProgress: 5, todo: 6 },
]

export default function TasksByAssignee() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed" />
        <Bar dataKey="inProgress" stackId="a" fill="#8884d8" name="In Progress" />
        <Bar dataKey="todo" stackId="a" fill="#ffc658" name="To Do" />
      </BarChart>
    </ResponsiveContainer>
  )
}

