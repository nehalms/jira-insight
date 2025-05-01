"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Week 1", created: 40, completed: 24 },
  { name: "Week 2", created: 30, completed: 35 },
  { name: "Week 3", created: 20, completed: 38 },
  { name: "Week 4", created: 27, completed: 32 },
  { name: "Week 5", created: 18, completed: 29 },
  { name: "Week 6", created: 23, completed: 29 },
]

export default function TasksOverTime() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
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
        <Line type="monotone" dataKey="created" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  )
}

