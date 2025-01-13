import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ListFilter } from 'lucide-react'

interface BulkActionsDropdownProps {
  selectedCount: number
  onAccept: () => void
  onReject: () => void
}

export function BulkActionsDropdown({ selectedCount, onAccept, onReject }: BulkActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          className="w-full sm:w-auto bg-[#15397F] text-white hover:bg-[#15397F]/90"
          disabled={selectedCount === 0}
        >
          <ListFilter className="w-4 h-4 mr-2" />
          Bulk Actions ({selectedCount})
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onAccept}>
          Accept Selected
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onReject}>
          Reject Selected
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 