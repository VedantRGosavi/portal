'use client'
// app/admin/page.tsx
import { useState, useEffect } from 'react'
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
import { createClient } from '@/utils/supabase/client'
import { useToast } from "@/hooks/use-toast"
import { CSVLink } from 'react-csv'
import { BulkActionsDropdown } from "@/components/ui/bulk-actions-dropdown"
import { StatsCard } from "@/components/ui/stats-card"
import { TablePagination } from "@/components/ui/table-pagination"
import { useRouter } from 'next/navigation'

interface Application {
  id: string
  user_id: string
  name: string
  email: string
  status: 'Under Review' | 'Accepted' | 'Rejected'
  submitted: string
  school?: string
  study_level?: string
}

interface Stats {
  total: number
  pending: number
  accepted: number
  rejected: number
}

const ITEMS_PER_PAGE = 10

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, rejected: 0 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedApplications, setSelectedApplications] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  const supabase = createClient()
  const { toast } = useToast()
  const router = useRouter()

  // Add verifyAdminStatus function
  const verifyAdminStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return false

      const { data: profile } = await supabase
        .from('profile')
        .select('role')
        .eq('id', user.id)
        .single()

      return profile?.role === 'admin'
    } catch (error) {
      console.error('Error verifying admin status:', error)
      return false
    }
  }

  // Fetch applications and calculate stats
  const fetchApplications = async () => {
    try {
      const isAdmin = await verifyAdminStatus()
      if (!isAdmin) {
        toast({
          title: "Unauthorized",
          description: "You do not have permission to access this page",
          variant: "destructive",
        })
        router.push('/dashboard')
        return
      }

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profile:user_id (
            display_name,
            email,
            school
          )
        `)
        .neq('status', 'Draft')
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!data) {
        setApplications([])
        setStats({ total: 0, pending: 0, accepted: 0, rejected: 0 })
        return
      }

      const formattedApplications: Application[] = data.map(app => ({
        id: app.id,
        user_id: app.user_id,
        name: app.profile?.display_name || 'Unknown',
        email: app.profile?.email || 'No email',
        status: app.status || 'Under Review',
        submitted: new Date(app.created_at).toLocaleDateString(),
        school: app.profile?.school || '',
        study_level: app.study_level || ''
      }))

      setApplications(formattedApplications)
      
      const stats = {
        total: formattedApplications.length,
        pending: formattedApplications.filter(app => app.status === 'Under Review').length,
        accepted: formattedApplications.filter(app => app.status === 'Accepted').length,
        rejected: formattedApplications.filter(app => app.status === 'Rejected').length
      }

      setStats(stats)
    } catch (error) {
      console.error('Error fetching applications:', error)
      toast({
        title: "Error",
        description: "Failed to load applications. Please try refreshing the page.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter applications based on search and status
  useEffect(() => {
    let filtered = [...applications]
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.school?.toLowerCase().includes(searchLower)
      )
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status.toLowerCase() === statusFilter)
    }
    
    setFilteredApplications(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [search, statusFilter, applications])

  // Pagination calculations
  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedApplications = filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Modify updateStatus function
  const updateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const isAdmin = await verifyAdminStatus()
      if (!isAdmin) {
        toast({
          title: "Unauthorized",
          description: "You do not have permission to perform this action",
          variant: "destructive",
        })
        router.push('/dashboard')
        return
      }

      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId)

      if (error) throw error

      // Update local state
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId ? { ...app, status: newStatus as Application['status'] } : app
        )
      )

      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  // Modify handleBulkAction function
  const handleBulkAction = async (action: 'accept' | 'reject') => {
    try {
      const isAdmin = await verifyAdminStatus()
      if (!isAdmin) {
        toast({
          title: "Unauthorized",
          description: "You do not have permission to perform this action",
          variant: "destructive",
        })
        router.push('/dashboard')
        return
      }

      const newStatus = action === 'accept' ? 'Accepted' : 'Rejected'
      
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .in('id', selectedApplications)

      if (error) throw error

      // Update local state
      setApplications(apps =>
        apps.map(app =>
          selectedApplications.includes(app.id) 
            ? { ...app, status: newStatus as Application['status'] } 
            : app
        )
      )

      setSelectedApplications([])
      toast({
        title: "Bulk Update Complete",
        description: `Updated ${selectedApplications.length} applications`,
      })
    } catch (error) {
      console.error('Error in bulk update:', error)
      toast({
        title: "Error",
        description: "Failed to perform bulk update",
        variant: "destructive",
      })
    }
  }

  // Prepare export data
  const exportData = applications.map(app => ({
    Name: app.name,
    Email: app.email,
    School: app.school || 'N/A',
    'Study Level': app.study_level || 'N/A',
    Status: app.status,
    'Submission Date': app.submitted
  }))

  const csvString = [
    // Headers
    ['Name', 'Email', 'School', 'Study Level', 'Status', 'Submission Date'],
    // Data rows
    ...exportData.map(row => [row.Name, row.Email, row.School, row['Study Level'], row.Status, row['Submission Date']])
  ].map(row => row.join(',')).join('\n')

  const blob = new Blob(['\ufeff', csvString], { type: 'text/csv;charset=utf-8;' })

  const statsConfig = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Under Review",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Accepted",
      value: stats.accepted,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-500/10"
    }
  ]

  // Modify the useEffect to check authorization first
  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profile')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          router.push('/dashboard')
          return
        }

        setIsAuthorized(true)
        fetchApplications()
      } catch (error) {
        console.error('Error checking authorization:', error)
        toast({
          title: "Error",
          description: "You are not authorized to view this page",
          variant: "destructive",
        })
        router.push('/dashboard')
      }
    }

    checkAuthAndFetchData()
  }, [router, supabase, toast])

  if (!isAuthorized || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#F5F7F9]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-[#15397F] font-franklin">
          Application Review Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <Button 
            variant="outline" 
            onClick={() => {
              const link = document.createElement('a')
              link.href = URL.createObjectURL(blob)
              link.download = `applications-${new Date().toISOString().split('T')[0]}.csv`
              link.click()
              URL.revokeObjectURL(link.href)
            }}
            className="w-full sm:w-auto bg-[#15397F] text-white hover:bg-[#15397F]/90 hover:text-white font-franklin"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <BulkActionsDropdown
            selectedCount={selectedApplications.length}
            onAccept={() => handleBulkAction('accept')}
            onReject={() => handleBulkAction('reject')}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search applicants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border-[#15397F] text-[#15397F] placeholder:text-[#15397F]/50 font-franklin"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] border-[#15397F] text-[#15397F] font-franklin">
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

      <div className="border border-[#15397F] rounded-lg overflow-x-auto bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-[#15397F] hover:bg-[#15397F]/5">
              <TableHead className="text-[#15397F] font-franklin">
                <input
                  type="checkbox"
                  checked={selectedApplications.length > 0 && selectedApplications.length === paginatedApplications.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedApplications(paginatedApplications.map(app => app.id))
                    } else {
                      setSelectedApplications([])
                    }
                  }}
                  className="rounded border-[#15397F]"
                />
              </TableHead>
              <TableHead className="text-[#15397F] font-franklin">APPLICANT</TableHead>
              <TableHead className="text-[#15397F] hidden md:table-cell font-franklin">EMAIL</TableHead>
              <TableHead className="text-[#15397F] font-franklin">STATUS</TableHead>
              <TableHead className="text-[#15397F] hidden sm:table-cell font-franklin">SUBMITTED</TableHead>
              <TableHead className="text-[#15397F] font-franklin">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.map((application) => (
              <TableRow key={application.id} className="border-b border-[#15397F]/20 hover:bg-[#15397F]/5">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedApplications.includes(application.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedApplications([...selectedApplications, application.id])
                      } else {
                        setSelectedApplications(selectedApplications.filter(id => id !== application.id))
                      }
                    }}
                    className="rounded border-[#15397F]"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8 border border-[#15397F]">
                      <AvatarFallback className="bg-[#15397F] text-white text-xs font-franklin">
                        {application.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[#15397F] font-franklin">{application.name}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-[#15397F] font-franklin">{application.email}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 text-xs rounded-full font-franklin ${
                    application.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {application.status}
                  </span>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-[#15397F] font-franklin">{application.submitted}</TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="text-[#15397F] hover:text-[#15397F]/80 p-0 font-franklin underline-offset-4"
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredApplications.length}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  )
}

