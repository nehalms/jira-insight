"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// const data = [
//   { name: "To Do", value: 45, color: "#8884d8" },
//   { name: "In Progress", value: 30, color: "#83a6ed" },
//   { name: "In Review", value: 15, color: "#8dd1e1" },
//   { name: "Done", value: 60, color: "#82ca9d" },
// ]

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d"]

interface TaskStatusData {
  name: string;
  value: number;
  color: string;
}

interface TasksByStatusProps {
  sprintId: string
}

export default function TasksByStatus({ sprintId }: TasksByStatusProps) {

  const [data, setData] = useState<TaskStatusData[]>([]);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/charts/task_by_status`, payload);
      // console.log("task by status:", res.data);
      const parsedData = Object.keys(res.data.task_status).map((key: string) => ({
        name: key,
        value: res.data.task_status[key],
        color: COLORS[Object.keys(res.data.task_status).indexOf(key) % COLORS.length],
      }));
      setData(parsedData);
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
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={'70%'}
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
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

