"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for user tasks across sprints
const data = [
  {
    sprint: "Sprint 1",
    Alex: 8,
    Taylor: 12,
    Jordan: 7,
    Casey: 10,
    Morgan: 6,
  },
  {
    sprint: "Sprint 2",
    Alex: 10,
    Taylor: 8,
    Jordan: 9,
    Casey: 11,
    Morgan: 7,
  },
  {
    sprint: "Sprint 3",
    Alex: 12,
    Taylor: 10,
    Jordan: 8,
    Casey: 9,
    Morgan: 11,
  },
  {
    sprint: "Sprint 4",
    Alex: 9,
    Taylor: 11,
    Jordan: 12,
    Casey: 8,
    Morgan: 10,
  },
  {
    sprint: "Sprint 5",
    Alex: 11,
    Taylor: 9,
    Jordan: 10,
    Casey: 12,
    Morgan: 8,
  },
]

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]

export default function UserTasksAcrossSprints() {
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
        <XAxis dataKey="sprint" />
        <YAxis />
        <Tooltip />
        <Legend />
        {Object.keys(data[0])
          .filter((key) => key !== "sprint")
          .map((user, index) => (
            <Line
              key={user}
              type="monotone"
              dataKey={user}
              stroke={colors[index % colors.length]}
              activeDot={{ r: 8 }}
            />
          ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

