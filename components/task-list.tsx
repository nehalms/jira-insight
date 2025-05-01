"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

// Mock data
const tasks = [
  {
    id: 1,
    title: "Update user authentication",
    status: "To Do",
    priority: "high",
    assignee: "Alex",
    dueDate: "2025-03-20",
  },
  {
    id: 2,
    title: "Fix navigation menu on mobile",
    status: "To Do",
    priority: "medium",
    assignee: "Taylor",
    dueDate: "2025-03-22",
  },
  {
    id: 3,
    title: "Add dark mode support",
    status: "In Progress",
    priority: "low",
    assignee: "Jordan",
    dueDate: "2025-03-25",
  },
  {
    id: 4,
    title: "Implement search functionality",
    status: "In Progress",
    priority: "medium",
    assignee: "Casey",
    dueDate: "2025-03-18",
  },
  {
    id: 5,
    title: "Optimize database queries",
    status: "In Review",
    priority: "high",
    assignee: "Morgan",
    dueDate: "2025-03-15",
  },
  {
    id: 6,
    title: "Create user dashboard",
    status: "Done",
    priority: "medium",
    assignee: "Alex",
    dueDate: "2025-03-10",
  },
  {
    id: 7,
    title: "Implement file upload feature",
    status: "Done",
    priority: "medium",
    assignee: "Taylor",
    dueDate: "2025-03-08",
  },
  {
    id: 8,
    title: "Refactor API endpoints",
    status: "Done",
    priority: "low",
    assignee: "Jordan",
    dueDate: "2025-03-05",
  },
]

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case "To Do":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    case "In Review":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
  }
}

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function TaskList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Export</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{getInitials(task.assignee)}</AvatarFallback>
                    </Avatar>
                    <span>{task.assignee}</span>
                  </div>
                </TableCell>
                <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

