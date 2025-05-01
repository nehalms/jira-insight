"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for tasks across projects
const data = [
  {
    project: "Web App",
    todo: 15,
    inProgress: 8,
    review: 5,
    done: 25,
  },
  {
    project: "Mobile App",
    todo: 10,
    inProgress: 12,
    review: 7,
    done: 18,
  },
  {
    project: "API",
    todo: 8,
    inProgress: 5,
    review: 3,
    done: 20,
  },
  {
    project: "Documentation",
    todo: 5,
    inProgress: 3,
    review: 2,
    done: 15,
  },
  {
    project: "DevOps",
    todo: 7,
    inProgress: 4,
    review: 2,
    done: 12,
  },
]

export default function TasksAcrossProjects() {
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
        <XAxis dataKey="project" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="todo" stackId="a" fill="#8884d8" name="To Do" />
        <Bar dataKey="inProgress" stackId="a" fill="#83a6ed" name="In Progress" />
        <Bar dataKey="review" stackId="a" fill="#8dd1e1" name="In Review" />
        <Bar dataKey="done" stackId="a" fill="#82ca9d" name="Done" />
      </BarChart>
    </ResponsiveContainer>
  )
}

