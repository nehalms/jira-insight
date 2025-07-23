"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

// Mock data for issue types distribution
// const data = [
//   { name: "Bug", value: 35, color: "#ff6b6b" },
//   { name: "Feature", value: 45, color: "#4ecdc4" },
//   { name: "Task", value: 30, color: "#ffe66d" },
//   { name: "Epic", value: 15, color: "#1a535c" },
//   { name: "Story", value: 25, color: "#ff9f1c" },
// ]

interface IssueTypesDistributionData {
  name: string;
  value: number;
  color: string;
}

interface IssueTypesDistributionProps {
  sprintId: string
}

const COLORS = ["#ff6b6b", "#4ecdc4", "#ffe66d", "#1a535c", "#ff9f1c"]

export default function IssueTypesDistribution({ sprintId }: IssueTypesDistributionProps) {
  const [data, setData] = useState<IssueTypesDistributionData[]>([]);
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
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/charts/issues_by_label`, payload);
      // console.log("Issue type distribution :", res.data);
      const parsedData = Object.keys(res.data.issues_by_label).map((key: string) => ({
        name: key,
        value: res.data.issues_by_label[key],
        color: COLORS[Object.keys(res.data.issues_by_label).indexOf(key) % COLORS.length],
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
              outerRadius={80}
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

