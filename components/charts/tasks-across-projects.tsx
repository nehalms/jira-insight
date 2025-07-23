"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for tasks across projects
// const data = [
//   {
//     project: "Web App",
//     todo: 15,
//     inProgress: 8,
//     review: 5,
//     done: 25,
//   },
//   {
//     project: "Mobile App",
//     todo: 10,
//     inProgress: 12,
//     review: 7,
//     done: 18,
//   },
//   {
//     project: "API",
//     todo: 8,
//     inProgress: 5,
//     review: 3,
//     done: 20,
//   },
//   {
//     project: "Documentation",
//     todo: 5,
//     inProgress: 3,
//     review: 2,
//     done: 15,
//   },
//   {
//     project: "DevOps",
//     todo: 7,
//     inProgress: 4,
//     review: 2,
//     done: 12,
//   },
// ]

interface obj {
  value: string,
  label: string
}

interface TaskAcrossProjectsProps {
  projectsData: obj[]
}

interface TaskAcrossProjectsdata {
  project: string,
  todo: number,
  inProgress: number,
  review: number,
  done: number,
}

export default function TasksAcrossProjects({ projectsData }: TaskAcrossProjectsProps) {
  const [data, setData] = useState<TaskAcrossProjectsdata []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  useEffect (() => {
    fetchData(projectsData);
  }, [projectsData]);

  const fetchData = async (projectdata: obj[]) => {
    try {
      setIsLoading(true);
      const payload = {
        "project_info": projectdata.reduce((acc: Record<string, string>, obj) => {
          acc[String(obj.value)] = obj.label
          return acc;
        }, {}),
      };
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/advanced/tasks_across_projects`, payload);
      // console.log("task across projects:", res.data);
      const parsedData = Object.entries(res.data.tasks_by_project).map(
        ([project, status]) => ({
          project: project,
          todo: (status as Record<string, number>)["To Do"] || 0,
          inProgress: (status as Record<string, number>)["In Progress"] || 0,
          review: (status as Record<string, number>)["Completed"] || 0,
          done: (status as Record<string, number>)["Completed"] || 0,
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
              dataKey="project"
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
            <Bar dataKey="todo" stackId="a" fill="#8884d8" name="To Do" />
            <Bar dataKey="inProgress" stackId="a" fill="#83a6ed" name="In Progress" />
            <Bar dataKey="review" stackId="a" fill="#8dd1e1" name="In Review" />
            <Bar dataKey="done" stackId="a" fill="#82ca9d" name="Done" />
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

