"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { Badge } from "@/components/ui/badge"
import { addDays } from "date-fns"

export function FiltersDialog() {
  const [open, setOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState({
    priority: [],
    type: [],
    status: [],
    labels: [],
  })

  const [dateRange, setDateRange] = useState({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleFilterChange = (category, value) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter((item) => item !== value)
      } else {
        newFilters[category] = [...newFilters[category], value]
      }
      return newFilters
    })
  }

  const handleDateRangeChange = (range) => {
    if (range?.from) {
      setDateRange(range)
    }
  }

  const applyFilters = () => {
    // Count total selected filters (including date range if set)
    const filterCount = Object.values(selectedFilters).flat().length + (dateRange.from && dateRange.to ? 1 : 0)
    setActiveFiltersCount(filterCount)
    setOpen(false)

    // Here you would typically apply the filters to your data
    console.log("Applied filters:", { ...selectedFilters, dateRange })
  }

  const clearFilters = () => {
    setSelectedFilters({
      priority: [],
      type: [],
      status: [],
      labels: [],
    })
    setDateRange({
      from: addDays(new Date(), -30),
      to: new Date(),
    })
    setActiveFiltersCount(0)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1">
          <Filter className="h-4 w-4" />
          More Filters
          {activeFiltersCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filter Tasks</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Priority</h3>
            <div className="grid grid-cols-2 gap-2">
              {["High", "Medium", "Low", "None"].map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={selectedFilters.priority.includes(priority)}
                    onCheckedChange={() => handleFilterChange("priority", priority)}
                  />
                  <Label htmlFor={`priority-${priority}`}>{priority}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Issue Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Bug", "Feature", "Task", "Epic", "Story"].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type}`}
                    checked={selectedFilters.type.includes(type)}
                    onCheckedChange={() => handleFilterChange("type", type)}
                  />
                  <Label htmlFor={`type-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Status</h3>
            <div className="grid grid-cols-2 gap-2">
              {["To Do", "In Progress", "In Review", "Done", "Blocked"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={selectedFilters.status.includes(status)}
                    onCheckedChange={() => handleFilterChange("status", status)}
                  />
                  <Label htmlFor={`status-${status}`}>{status}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Labels</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Frontend", "Backend", "UI/UX", "Database", "DevOps", "Documentation"].map((label) => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox
                    id={`label-${label}`}
                    checked={selectedFilters.labels.includes(label)}
                    onCheckedChange={() => handleFilterChange("labels", label)}
                  />
                  <Label htmlFor={`label-${label}`}>{label}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Due Date Range</h3>
            <DatePickerWithRange onChange={handleDateRangeChange} />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button onClick={applyFilters}>Apply Filters</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

