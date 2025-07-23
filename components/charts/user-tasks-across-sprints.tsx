"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for user tasks across sprints
// const data = [
//   {
//     sprint: "Sprint 1",
//     Alex: 8,
//     Taylor: 12,
//     Jordan: 7,
//     Casey: 10,
//     Morgan: 6,
//   },
//   {
//     sprint: "Sprint 2",
//     Alex: 10,
//     Taylor: 8,
//     Jordan: 9,
//     Casey: 11,
//     Morgan: 7,
//   },
//   {
//     sprint: "Sprint 3",
//     Alex: 12,
//     Taylor: 10,
//     Jordan: 8,
//     Casey: 9,
//     Morgan: 11,
//   },
//   {
//     sprint: "Sprint 4",
//     Alex: 9,
//     Taylor: 11,
//     Jordan: 12,
//     Casey: 8,
//     Morgan: 10,
//   },
//   {
//     sprint: "Sprint 5",
//     Alex: 11,
//     Taylor: 9,
//     Jordan: 10,
//     Casey: 12,
//     Morgan: 8,
//   },
// ]

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"]

interface UserTaskAcrossSprintsData {
  sprint: string;
  [userName: string]: string | number;
}

interface UserTaskAcrossSprintsProps {
  boardId: string;
}

export default function UserTasksAcrossSprints({ boardId }: UserTaskAcrossSprintsProps) {
  const [data, setData] = useState<UserTaskAcrossSprintsData[]>([]);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/advanced/user_tasks_across_sprints`, payload);
      // console.log("user task across sprints:", res.data);
      const parsedData = Object.entries(res.data.user_tasks_across_sprints).map(
        ([sprint, users]) => ({
          sprint: sprint,
          ...(typeof users === "object" && users !== null ? users : {}),
        })
      );
      console.log(parsedData);
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
              dataKey="sprint"
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
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

