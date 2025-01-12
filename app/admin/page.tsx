'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users, Clock, CheckCircle, XCircle, Download, ListFilter } from 'lucide-react'

// Mock data for demonstration
const mockApplications = [
  {
    id: 1,
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    status: "Under Review",
    submitted: "2024-02-15",
  },
  // Add more mock data as needed
]

export default function AdminDashboard() {
  const [search, setSearch] = useState('')

  const stats = [
    {
      title: "Total Applications",
      value: "256",
      icon: Users,
      color: "text-[#15397F]",
      bgColor: "bg-[#15397F]/10",
    },
    {
      title: "Pending Review",
      value: "64",
      icon: Clock,
      color: "text-[#FFDA00]",
      bgColor: "bg-[#FFDA00]/10",
    },
    {
      title: "Accepted",
      value: "128",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Rejected",
      value: "64",
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#15397F]">Application Review Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button variant="outline" className="w-full sm:w-auto border-[#15397F] text-[#FFDA00] hover:bg-[#15397F] hover:text-[#FFDA00]">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="w-full sm:w-auto bg-[#15397F] text-white hover:bg-[#15397F]/90">
            <ListFilter className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-background border-[#15397F]">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-background border-[#15397F] text-foreground"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] border-[#15397F] text-foreground">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Under Review</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-[#15397F] rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#15397F] hover:bg-[#15397F]/5">
              <TableHead className="text-[#FFDA00]">APPLICANT</TableHead>
              <TableHead className="text-[#FFDA00] hidden md:table-cell">EMAIL</TableHead>
              <TableHead className="text-[#FFDA00]">STATUS</TableHead>
              <TableHead className="text-[#FFDA00] hidden sm:table-cell">SUBMITTED</TableHead>
              <TableHead className="text-[#FFDA00]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockApplications.map((application) => (
              <TableRow key={application.id} className="border-b border-[#15397F] hover:bg-[#15397F]/5">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border border-[#15397F]">
                      <AvatarFallback className="bg-[#15397F] text-[#FFDA00] text-xs">
                        {application.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-foreground">{application.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-foreground">{application.email}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs rounded-full bg-[#FFDA00]/10 text-[#FFDA00]">
                    {application.status}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-foreground">{application.submitted}</TableCell>
                <TableCell>
                  <Button variant="link" className="text-[#15397F] hover:text-[#FFDA00] p-0">
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Showing 1 to 10 of 256 results
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled className="border-[#15397F] text-foreground">
            Previous
          </Button>
          <Button variant="outline" className="border-[#15397F] bg-[#15397F] text-[#FFDA00]">
            1
          </Button>
          <Button variant="outline" className="border-[#15397F] text-foreground hover:bg-[#15397F] hover:text-[#FFDA00]">
            2
          </Button>
          <Button variant="outline" className="border-[#15397F] text-foreground hover:bg-[#15397F] hover:text-[#FFDA00]">
            3
          </Button>
          <Button variant="outline" className="border-[#15397F] text-foreground hover:bg-[#15397F] hover:text-[#FFDA00]">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

