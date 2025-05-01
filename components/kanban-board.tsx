"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock data
const initialColumns = {
  todo: {
    id: "todo",
    title: "To Do",
    taskIds: ["task-1", "task-2", "task-3", "task-4"],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    taskIds: ["task-5", "task-6", "task-7"],
  },
  review: {
    id: "review",
    title: "In Review",
    taskIds: ["task-8", "task-9"],
  },
  done: {
    id: "done",
    title: "Done",
    taskIds: ["task-10", "task-11", "task-12", "task-13"],
  },
}

const initialTasks = {
  "task-1": { id: "task-1", title: "Update user authentication", priority: "high", assignee: "Alex" },
  "task-2": { id: "task-2", title: "Fix navigation menu on mobile", priority: "medium", assignee: "Taylor" },
  "task-3": { id: "task-3", title: "Add dark mode support", priority: "low", assignee: "Jordan" },
  "task-4": { id: "task-4", title: "Implement search functionality", priority: "medium", assignee: "Casey" },
  "task-5": { id: "task-5", title: "Optimize database queries", priority: "high", assignee: "Morgan" },
  "task-6": { id: "task-6", title: "Create user dashboard", priority: "medium", assignee: "Alex" },
  "task-7": { id: "task-7", title: "Implement file upload feature", priority: "medium", assignee: "Taylor" },
  "task-8": { id: "task-8", title: "Refactor API endpoints", priority: "low", assignee: "Jordan" },
  "task-9": { id: "task-9", title: "Add unit tests for auth module", priority: "high", assignee: "Casey" },
  "task-10": { id: "task-10", title: "Update documentation", priority: "low", assignee: "Morgan" },
  "task-11": { id: "task-11", title: "Fix payment integration bugs", priority: "high", assignee: "Alex" },
  "task-12": { id: "task-12", title: "Implement email notifications", priority: "medium", assignee: "Taylor" },
  "task-13": { id: "task-13", title: "Optimize image loading", priority: "low", assignee: "Jordan" },
}

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

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns)
  const [tasks, setTasks] = useState(initialTasks)

  // In a real app, you would implement drag and drop functionality here

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
      {Object.values(columns).map((column) => (
        <div key={column.id} className="min-w-[250px]">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">{column.title}</h3>
            <Badge variant="outline">{column.taskIds.length}</Badge>
          </div>
          <div className="space-y-3">
            {column.taskIds.map((taskId) => {
              const task = tasks[taskId]
              return (
                <Card key={task.id} className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardHeader className="p-3 pb-0">
                    <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <Badge className={`${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">{getInitials(task.assignee)}</AvatarFallback>
                      </Avatar>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

