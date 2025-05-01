"use client"

import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from "recharts"

// Mock data for velocity chart
const data = [
  {
    sprint: "Sprint 1",
    completed: 45,
    committed: 50,
    average: 45,
  },
  {
    sprint: "Sprint 2",
    completed: 52,
    committed: 55,
    average: 48.5,
  },
  {
    sprint: "Sprint 3",
    completed: 47,
    committed: 50,
    average: 48,
  },
  {
    sprint: "Sprint 4",
    completed: 53,
    committed: 55,
    average: 49.25,
  },
  {
    sprint: "Sprint 5",
    completed: 58,
    committed: 60,
    average: 51,
  },
]

export default function VelocityChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="sprint" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="completed" fill="#8884d8" name="Completed Points" />
        <Bar dataKey="committed" fill="#82ca9d" name="Committed Points" />
        <Line type="monotone" dataKey="average" stroke="#ff7300" name="Average Velocity" strokeWidth={2} />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

