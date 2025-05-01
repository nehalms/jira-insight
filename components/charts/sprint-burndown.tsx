"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

// Mock data for sprint burndown
const data = [
  { day: "Day 1", remainingPoints: 120, idealBurndown: 120 },
  { day: "Day 2", remainingPoints: 115, idealBurndown: 110 },
  { day: "Day 3", remainingPoints: 108, idealBurndown: 100 },
  { day: "Day 4", remainingPoints: 105, idealBurndown: 90 },
  { day: "Day 5", remainingPoints: 95, idealBurndown: 80 },
  { day: "Day 6", remainingPoints: 90, idealBurndown: 70 },
  { day: "Day 7", remainingPoints: 85, idealBurndown: 60 },
  { day: "Day 8", remainingPoints: 70, idealBurndown: 50 },
  { day: "Day 9", remainingPoints: 65, idealBurndown: 40 },
  { day: "Day 10", remainingPoints: 50, idealBurndown: 30 },
  { day: "Day 11", remainingPoints: 30, idealBurndown: 20 },
  { day: "Day 12", remainingPoints: 20, idealBurndown: 10 },
  { day: "Day 13", remainingPoints: 10, idealBurndown: 5 },
  { day: "Day 14", remainingPoints: 5, idealBurndown: 0 },
]

export default function SprintBurndown() {
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
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <ReferenceLine y={0} stroke="#000" />
        <Line
          type="monotone"
          dataKey="remainingPoints"
          stroke="#8884d8"
          name="Actual Remaining"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        <Line type="monotone" dataKey="idealBurndown" stroke="#82ca9d" name="Ideal Burndown" strokeDasharray="5 5" />
      </LineChart>
    </ResponsiveContainer>
  )
}

