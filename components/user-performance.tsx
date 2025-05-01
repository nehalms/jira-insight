"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { Progress } from "@/components/ui/progress"

// Mock data for user performance
const taskCompletionData = [
  { week: "Week 1", completed: 8, teamAvg: 7 },
  { week: "Week 2", completed: 10, teamAvg: 8 },
  { week: "Week 3", completed: 7, teamAvg: 9 },
  { week: "Week 4", completed: 12, teamAvg: 8 },
  { week: "Week 5", completed: 9, teamAvg: 7 },
  { week: "Week 6", completed: 11, teamAvg: 8 },
]

const taskStatusData = [
  { name: "To Do", value: 5, color: "#8884d8" },
  { name: "In Progress", value: 3, color: "#83a6ed" },
  { name: "In Review", value: 2, color: "#8dd1e1" },
  { name: "Done", value: 45, color: "#82ca9d" },
]

const taskPriorityData = [
  { name: "High", value: 12, color: "#ff6b6b" },
  { name: "Medium", value: 25, color: "#ffc658" },
  { name: "Low", value: 18, color: "#82ca9d" },
]

const projectContributionData = [
  { project: "Web App", tasks: 18 },
  { project: "Mobile App", tasks: 12 },
  { project: "API", tasks: 8 },
  { project: "Documentation", tasks: 5 },
  { project: "DevOps", tasks: 7 },
]

export default function UserPerformance({ username = "Alex" }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">+12% from previous period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion Time</CardTitle>
            <CardDescription>Time to resolve tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8 days</div>
            <p className="text-xs text-muted-foreground">-0.5 days from team average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Story Points</CardTitle>
            <CardDescription>Current sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32/40</div>
            <Progress value={80} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Velocity</CardTitle>
            <CardDescription>Points per sprint</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground">+5 from team average</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Completion Over Time</CardTitle>
            <CardDescription>Compared to team average</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={taskCompletionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name={`${username}'s Tasks`}
                />
                <Line type="monotone" dataKey="teamAvg" stroke="#82ca9d" strokeDasharray="5 5" name="Team Average" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Contributions</CardTitle>
            <CardDescription>Tasks completed by project</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={projectContributionData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="project" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="tasks" fill="#8884d8" name="Tasks Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Priority</CardTitle>
            <CardDescription>Current distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskPriorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskPriorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

