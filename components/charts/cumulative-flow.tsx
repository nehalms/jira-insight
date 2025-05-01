"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for cumulative flow diagram
const data = [
  {
    date: "3/1",
    done: 10,
    inReview: 5,
    inProgress: 15,
    todo: 50,
  },
  {
    date: "3/5",
    done: 15,
    inReview: 8,
    inProgress: 20,
    todo: 42,
  },
  {
    date: "3/10",
    done: 25,
    inReview: 10,
    inProgress: 18,
    todo: 32,
  },
  {
    date: "3/15",
    done: 35,
    inReview: 12,
    inProgress: 15,
    todo: 23,
  },
  {
    date: "3/20",
    done: 45,
    inReview: 8,
    inProgress: 12,
    todo: 20,
  },
  {
    date: "3/25",
    done: 55,
    inReview: 5,
    inProgress: 10,
    todo: 15,
  },
  {
    date: "3/30",
    done: 65,
    inReview: 3,
    inProgress: 7,
    todo: 10,
  },
]

export default function CumulativeFlow() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="todo" stackId="1" stroke="#8884d8" fill="#8884d8" name="To Do" />
        <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#83a6ed" fill="#83a6ed" name="In Progress" />
        <Area type="monotone" dataKey="inReview" stackId="1" stroke="#8dd1e1" fill="#8dd1e1" name="In Review" />
        <Area type="monotone" dataKey="done" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Done" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

