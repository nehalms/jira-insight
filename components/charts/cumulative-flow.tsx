"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for cumulative flow diagram
// const data = [
//   {
//     date: "3/1",
//     done: 10,
//     inReview: 5,
//     inProgress: 15,
//     todo: 50,
//   },
//   {
//     date: "3/5",
//     done: 15,
//     inReview: 8,
//     inProgress: 20,
//     todo: 42,
//   },
//   {
//     date: "3/10",
//     done: 25,
//     inReview: 10,
//     inProgress: 18,
//     todo: 32,
//   },
//   {
//     date: "3/15",
//     done: 35,
//     inReview: 12,
//     inProgress: 15,
//     todo: 23,
//   },
//   {
//     date: "3/20",
//     done: 45,
//     inReview: 8,
//     inProgress: 12,
//     todo: 20,
//   },
//   {
//     date: "3/25",
//     done: 55,
//     inReview: 5,
//     inProgress: 10,
//     todo: 15,
//   },
//   {
//     date: "3/30",
//     done: 65,
//     inReview: 3,
//     inProgress: 7,
//     todo: 10,
//   },
// ]

interface CumulativeData {
  date: string;
  done: number,
  inReview: number,
  inProgress: number,
  todo: number,
}

interface CumulativeProps {
  sprintId: string
}

export default function CumulativeFlow({ sprintId }: CumulativeProps) {
  const [data, setData] = useState<CumulativeData[]>([]);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/advanced/cumulative_flow`, payload);
      // console.log("Cumulative flow :", res.data);
      const parsedData = Object.entries(res.data).map(
        ([date, status]) => ({
          date: new Date(date).toLocaleDateString(),
          done: (status as Record<string, number>)["Done"] || 0,
          inReview: (status as Record<string, number>)["In Review"] || 0,
          inProgress: (status as Record<string, number>)["In Progress"] || 0,
          todo: (status as Record<string, number>)["To Do"] || 0,
        })
      );
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
            <XAxis 
              dataKey="date"
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
            <Area type="monotone" dataKey="todo" stackId="1" stroke="#8884d8" fill="#8884d8" name="To Do" />
            <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#83a6ed" fill="#83a6ed" name="In Progress" />
            <Area type="monotone" dataKey="inReview" stackId="1" stroke="#8dd1e1" fill="#8dd1e1" name="In Review" />
            <Area type="monotone" dataKey="done" stackId="1" stroke="#82ca9d" fill="#82ca9d" name="Done" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

