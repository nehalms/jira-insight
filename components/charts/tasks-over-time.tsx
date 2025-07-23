"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Week 1", created: 40, completed: 24 },
  { name: "Week 2", created: 30, completed: 35 },
  { name: "Week 3", created: 20, completed: 38 },
  { name: "Week 4", created: 27, completed: 32 },
  { name: "Week 5", created: 18, completed: 29 },
  { name: "Week 6", created: 23, completed: 29 },
]

interface TaskOverTimeData {
  name: string;
  created: number;
  completed: number;
}

interface TasksOverTimeProps {
  boardId: string;
}

export default function TasksOverTime({ boardId }: TasksOverTimeProps) {
  const [data, setData] = useState<TaskOverTimeData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect (() => {
    fetchData(boardId);
  }, [boardId]);

  const fetchData = async (boardId: string) => {
    try {
      setIsLoading(true);
      const payload = {
        "board_id" : boardId.toString(),
      }
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/advanced/task_over_time`, payload);
      // console.log("Task over time :", res.data);
      const parsedData = res.data.sprint_tasks.map((obj: { sprint_name: string; tasks_created: number; tasks_completed: number }) => ({
        name: obj.sprint_name,
        created: obj.tasks_created,
        completed: obj.tasks_completed,
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
            <Line type="monotone" dataKey="created" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="completed" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

