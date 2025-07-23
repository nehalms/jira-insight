"use client"

import axios from "axios";
import { useEffect, useState } from "react";
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
// const data = [
//   { day: "Day 1", remainingPoints: 120, idealBurndown: 120 },
//   { day: "Day 2", remainingPoints: 115, idealBurndown: 110 },
//   { day: "Day 3", remainingPoints: 108, idealBurndown: 100 },
//   { day: "Day 4", remainingPoints: 105, idealBurndown: 90 },
//   { day: "Day 5", remainingPoints: 95, idealBurndown: 80 },
//   { day: "Day 6", remainingPoints: 90, idealBurndown: 70 },
//   { day: "Day 7", remainingPoints: 85, idealBurndown: 60 },
//   { day: "Day 8", remainingPoints: 70, idealBurndown: 50 },
//   { day: "Day 9", remainingPoints: 65, idealBurndown: 40 },
//   { day: "Day 10", remainingPoints: 50, idealBurndown: 30 },
//   { day: "Day 11", remainingPoints: 30, idealBurndown: 20 },
//   { day: "Day 12", remainingPoints: 20, idealBurndown: 10 },
//   { day: "Day 13", remainingPoints: 10, idealBurndown: 5 },
//   { day: "Day 14", remainingPoints: 5, idealBurndown: 0 },
// ]

interface SprintBurnDownData {
  day: Date;
  remainingPoints: number;
  idealBurndown: number;
}

interface SprintBurnDownProps {
  sprintId: string
}

export default function SprintBurndown({ sprintId }: SprintBurnDownProps) {
  const [data, setData] = useState<SprintBurnDownData[]>([]);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/advanced/sprint_burndown`, payload);
      // console.log("Sprint burndoen :", res.data);
      const parsedData = res.data.actual_remaining.map((obj: { day: Date; remaining: number; idealBurnDown: number}) => ({
        day: obj.day || "",
        remainingPoints: obj.remaining || 0,
        idealBurndown: obj.idealBurnDown || 0,
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
              dataKey="day"
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
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}

