"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// const data = [
//   { name: "Alex", completed: 12, inProgress: 3, todo: 5 },
//   { name: "Taylor", completed: 18, inProgress: 4, todo: 2 },
//   { name: "Jordan", completed: 15, inProgress: 6, todo: 3 },
//   { name: "Casey", completed: 20, inProgress: 2, todo: 4 },
//   { name: "Morgan", completed: 14, inProgress: 5, todo: 6 },
// ]

interface TasksByAssignee {
  name: string;
  completed: number;
  inProgress: number;
  todo: number;
}

interface TasksByAssigneeProps {
  sprintId: string
}

export default function TasksByAssignee({ sprintId }: TasksByAssigneeProps) {
  const [data, setData] = useState<TasksByAssignee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect (() => {
    fetchData(sprintId);
  }, [sprintId]);

  const fetchData = async (sprintId: string) => {
    try {
      setIsLoading(true);
      const payload = {
        "sprint_id" : sprintId.toString(),
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/charts/task_by_assignee`, payload);
      // console.log("task by assignee:", res.data);
      const parsedData = Object.entries(res.data.tasks_by_assignee).map(
        ([name, status]) => ({
          name,
          todo: (status as Record<string, number>)["To Do"] || 0,
          inProgress: (status as Record<string, number>)["In Progress"] || 0,
          completed: (status as Record<string, number>)["Completed"] || 0,
        })
      );
      setData(parsedData);
      console.log(parsedData);
    } catch (error) { 
      console.error("Error fetching getting sprint values:", error)
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80 z-10">
          <span className="text-gray-500">Loading...</span>
        </div>
      ) : data && data.length > 0 ? (
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
            <XAxis 
              dataKey="name"
              interval={0}
              height={100}
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="end"
                    transform="rotate(-40)"
                    fontSize={12}
                    fill="#666"
                  >
                    {payload.value}
                  </text>
                </g>
              )}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" stackId="a" fill="#82ca9d" name="Completed" />
            <Bar dataKey="inProgress" stackId="a" fill="#8884d8" name="In Progress" />
            <Bar dataKey="todo" stackId="a" fill="#ffc658" name="To Do" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

