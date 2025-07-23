"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, List, PieChart, TrendingUp, Users, BarChart2, LogOut, Moon, Sun, Laptop } from "lucide-react"
import TasksOverTime from "@/components/charts/tasks-over-time"
import TasksByStatus from "@/components/charts/tasks-by-status"
import TasksByAssignee from "@/components/charts/tasks-by-assignee"
import UserTasksAcrossSprints from "@/components/charts/user-tasks-across-sprints"
import TasksAcrossProjects from "@/components/charts/tasks-across-projects"
import SprintBurndown from "@/components/charts/sprint-burndown"
import VelocityChart from "@/components/charts/velocity-chart"
import CumulativeFlow from "@/components/charts/cumulative-flow"
import IssueTypesDistribution from "@/components/charts/issue-types-distribution"
import KanbanBoard from "@/components/kanban-board"
import CalendarView from "@/components/calendar-view"
import TaskList from "@/components/task-list"
import UserPerformance from "@/components/user-performance"
import { FiltersDialog } from "@/components/filters-dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTheme } from "@/components/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import axios from "axios"

export default function Dashboard({ user, onLogout }: {user: any, onLogout: any}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [projectDropdownValues, setProjectDropdownValues] = useState<{ value: string; label: string }[]>([]);
  const [sprintDropdownValues, setSprintDropdownValues] = useState<{ value: string; label: string }[]>([]);
  const [userDropdownValues, setUserDropdownValues] = useState<{ value: string; label: string }[]>([]);

  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [cachedSelectedUser, setCachedSelectedUser] = useState("");
  const [dateRange, setDateRange] = useState("30days")

  const [selectProjectDisabled, setSelectProjectDisabled] = useState(false);
  const [selectSprintDisabled, setSelectSprintDisabled] = useState(true);
  const [selectUserDisabled, setSelectUserDisabled] = useState(true);

  const { theme, setTheme } = useTheme()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  useEffect(() => {
    getProjectsDropdownValues();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      getBoardId(selectedProjectId);
    }
  }, [selectedProjectId]);

  useEffect(() => { 
    if (selectedBoardId) {
      getSprintDropdownValues(selectedBoardId);
    }
  }, [selectedBoardId]);

  useEffect(() => {
    if(selectedSprintId) {
      getUserDropdowValues(selectedSprintId);
    }
  }, [selectedSprintId])

  useEffect(() => {
    if(selectedUser !== "all")
      setCachedSelectedUser(selectedUser);
  }, [selectedUser]);

  const handleTabChange = (value: string) => {
    if (["charts", "advanced-charts", "calendar"].includes(value)) {
      setSelectedUser("all");
      setSelectUserDisabled(true);
    } else {
      setSelectedUser(cachedSelectedUser);
      setSelectUserDisabled(false);
    }
  }

  const getProjectsDropdownValues = async () => {
    try {
      setSelectProjectDisabled(true);
      const res = await axios.get(`${API_URL}/projects`);
      // console.log("Projects Dropdown Values:", res.data);
      const newOptions = res.data.map((project: any) => ({
        value: project.id,
        label: project.name,
      }))
      .sort((a: any, b: any) => a.label.localeCompare(b.label));
      setProjectDropdownValues(newOptions);
    } catch (error) { 
      console.error("Error fetching fetchProjectsDropdownValues:", error)
    } finally { 
      setSelectProjectDisabled(false);
    }
  }

  const getBoardId = async (projectId: string) => {
    try {
      setSelectSprintDisabled(true);
      const payload = {
        "project_id" : projectId.toString(),   
      }
      const res = await axios.post(`${API_URL}/list_board`, payload);
      // console.log("Getting board id:", res.data);
      const boardId = res.data.id;
      setSelectedBoardId(boardId);
    } catch (error) { 
      console.error("Error fetching board id:", error)
    } finally {
      setSelectSprintDisabled(false);
    }
  }

  const getSprintDropdownValues = async (boardId: string) => {
    try {
      setSelectSprintDisabled(true);
      const payload = {
        "board_id" : boardId.toString(),
      }
      const res = await axios.post(`${API_URL}/sprints`, payload);
      // console.log("Sprint Dropdown Values:", res.data);
      const newOptions = res.data.values.map((sprint: any) => ({
        value: sprint.id,
        label: sprint.name,
      }))
      .sort((a: any, b: any) => a.label.localeCompare(b.label));
      setSprintDropdownValues(newOptions);
      setSelectedSprintId(newOptions[0]?.value || "");
    } catch (error) { 
      console.error("Error fetching getting sprint values:", error)
    } finally {
      setSelectSprintDisabled(false);
    }
  }

  const getUserDropdowValues = async (sprintId: string) => {
    try {
      const payload = {
        "sprint_id" : sprintId.toString(),
      }
      const res = await axios.post(`${API_URL}/get_users`, payload);
      // console.log("Users Dropdown Values:", res.data);
      const newOptions = res.data.users.map((user: any) => ({
        value: user.user_id,
        label: user.display_name,
      }))
      .sort((a: any, b: any) => a.label.localeCompare(b.label));
      newOptions.push({value: "all", label: "all"});
      setUserDropdownValues(newOptions);
      setSelectedUser('all');
    } catch (error) { 
      console.error("Error fetching getting sprint values:", error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            <span className="text-xl font-bold">Jira Insights</span>
          </div>
          <div className="ml-auto flex items-center gap-4 overflow-x-auto pb-2 md:pb-0">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId} disabled={selectProjectDisabled}>  
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {
                  projectDropdownValues.map((project: any) => (
                    <SelectItem key={project.value} value={project.value}>
                      {project.label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Select value={selectedSprintId} onValueChange={setSelectedSprintId} disabled={selectSprintDisabled}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sprint" />
              </SelectTrigger>
              <SelectContent>
                {
                  sprintDropdownValues.map((sprint: any) => (
                    <SelectItem key={sprint.value} value={sprint.value}>
                      {sprint.label}
                    </SelectItem>
                  ))
                }
              </SelectContent>
            </Select>
            <Select value={selectedUser} onValueChange={setSelectedUser} disabled={selectUserDisabled}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {
                  userDropdownValues
                    .filter((user: any) => user.value !== 'all')
                    .map((user: any) => (
                      <SelectItem key={user.value} value={user.value}>
                        {user.label}
                      </SelectItem>
                    ))
                }
                <SelectItem value="all">All Users</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            {/* <FiltersDialog /> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user?.name || "User")}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "user@example.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <div className="flex items-center gap-2">
                      {theme === "light" && <Sun className="h-4 w-4" />}
                      {theme === "dark" && <Moon className="h-4 w-4" />}
                      {theme === "system" && <Laptop className="h-4 w-4" />}
                      <span>Theme</span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop className="mr-2 h-4 w-4" />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <CardDescription>All tasks in selected period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">+12% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CardDescription>Tasks completed in period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">187</div>
              <p className="text-xs text-muted-foreground">+8% from previous period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Completion Time</CardTitle>
              <CardDescription>Time to resolve tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2 days</div>
              <p className="text-xs text-muted-foreground">-1.5 days from previous period</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="charts" className="space-y-4" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-6 md:w-auto w-full">
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Charts</span>
            </TabsTrigger>
            <TabsTrigger value="advanced-charts" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span className="hidden sm:inline">Advanced</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">Kanban</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Calendar</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </TabsTrigger>
            <TabsTrigger value="user" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">User</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="charts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks Across Projects</CardTitle>
                  <CardDescription>Task distribution by project and status</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { projectDropdownValues.length ? (
                    <TasksAcrossProjects projectsData={projectDropdownValues}/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a project</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tasks Over Time</CardTitle>
                  <CardDescription>Created vs Completed tasks</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedBoardId ? (
                    <TasksOverTime boardId={selectedBoardId}/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a project</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>User Tasks Across Sprints</CardTitle>
                  <CardDescription>Task completion by team member over time</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedBoardId ? (
                    <UserTasksAcrossSprints boardId={selectedBoardId}/>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a project</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="advanced-charts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              
              <Card>
                <CardHeader>
                  <CardTitle>Tasks By Status</CardTitle>
                  <CardDescription>Distribution across statuses</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedSprintId ? (
                    <TasksByStatus sprintId={selectedSprintId} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a sprint</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Tasks By Assignee</CardTitle>
                  <CardDescription>Task distribution across team members</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedSprintId ? (
                    <TasksByAssignee sprintId={selectedSprintId} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a sprint</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Issue Types Distribution</CardTitle>
                  <CardDescription>Breakdown by issue type</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedSprintId ? (
                    <IssueTypesDistribution sprintId={selectedSprintId} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a sprint</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sprint Burndown</CardTitle>
                  <CardDescription>Remaining work over sprint duration</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedSprintId ? (
                    <SprintBurndown sprintId={selectedSprintId} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a sprint</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Velocity Chart</CardTitle>
                  <CardDescription>Completed vs committed story points</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  <VelocityChart />
                </CardContent>
              </Card>
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Cumulative Flow</CardTitle>
                  <CardDescription>Task status distribution over time</CardDescription>
                </CardHeader>
                <CardContent className="h-96">
                  { selectedSprintId ? (
                    <CumulativeFlow sprintId={selectedSprintId} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 text-center">
                      <p>Please select a sprint</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="kanban">
            <Card>
              <CardHeader>
                <CardTitle>Kanban Board</CardTitle>
                <CardDescription>Visualize workflow stages</CardDescription>
              </CardHeader>
              <CardContent>
                <KanbanBoard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>Tasks by due date</CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarView />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>Detailed list of all tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="user">
            <Card>
              <CardHeader>
                <CardTitle>{selectedUser === "all" ? "User Performance" : `${selectedUser}'s Performance`}</CardTitle>
                <CardDescription>
                  {selectedUser === "all"
                    ? "Please select a user from the dropdown to view performance metrics"
                    : "Detailed metrics for selected user"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser === "all" ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Users className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No User Selected</h3>
                    <p className="text-muted-foreground max-w-md">
                      Select a specific user from the dropdown at the top to view their detailed performance metrics and
                      analytics.
                    </p>
                  </div>
                ) : (
                  <UserPerformance username={selectedUser} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

