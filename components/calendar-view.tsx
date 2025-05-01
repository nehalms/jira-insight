"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data - tasks with due dates
const tasksByDate = {
  "2025-03-15": [
    { id: 1, title: "Complete API documentation", priority: "medium" },
    { id: 2, title: "Review pull requests", priority: "high" },
  ],
  "2025-03-18": [{ id: 3, title: "Deploy new features", priority: "high" }],
  "2025-03-20": [
    { id: 4, title: "Team retrospective", priority: "medium" },
    { id: 5, title: "Update roadmap", priority: "low" },
  ],
  "2025-03-25": [{ id: 6, title: "Quarterly planning", priority: "high" }],
  "2025-03-28": [
    { id: 7, title: "Release v2.0", priority: "high" },
    { id: 8, title: "Send release notes", priority: "medium" },
  ],
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

export default function CalendarView() {
  const [date, setDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const formatDate = (date) => {
    return date.toISOString().split("T")[0]
  }

  const handleSelect = (date) => {
    setDate(date)
    setSelectedDate(formatDate(date))
  }

  // Function to highlight dates with tasks
  const getDayClassNames = (date) => {
    const formattedDate = formatDate(date)
    if (tasksByDate[formattedDate]) {
      return "bg-primary/20 text-primary font-bold"
    }
    return ""
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-md border"
          modifiersClassNames={{
            selected: "bg-primary text-primary-foreground",
          }}
          modifiers={{
            highlighted: (date) => tasksByDate[formatDate(date)] !== undefined,
          }}
          modifiersStyles={{
            highlighted: { fontWeight: "bold", backgroundColor: "hsl(var(--primary) / 0.1)" },
          }}
        />
      </div>
      <div>
        <h3 className="font-medium mb-4">
          {selectedDate
            ? new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Select a date to view tasks"}
        </h3>
        <div className="space-y-3">
          {selectedDate && tasksByDate[selectedDate] ? (
            tasksByDate[selectedDate].map((task) => (
              <Card key={task.id}>
                <CardContent className="p-3">
                  <div className="flex justify-between items-center">
                    <span>{task.title}</span>
                    <Badge className={`${getPriorityColor(task.priority)}`}>{task.priority}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : selectedDate ? (
            <p className="text-muted-foreground">No tasks scheduled for this date</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

