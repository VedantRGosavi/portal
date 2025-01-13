import { Button } from "@/components/ui/button"

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
}

export function TablePagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">
        Showing {startItem} to {endItem} of {totalItems} results
      </p>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-[#15397F] text-foreground"
        >
          Previous
        </Button>
        
        {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
          const pageNum = i + 1
          return (
            <Button
              key={pageNum}
              variant="outline"
              className={`border-[#15397F] ${
                pageNum === currentPage 
                  ? 'bg-[#15397F] text-[#FFDA00]' 
                  : 'text-foreground hover:bg-[#15397F] hover:text-[#FFDA00]'
              }`}
              onClick={() => onPageChange(pageNum)}
            >
              {pageNum}
            </Button>
          )
        })}

        <Button 
          variant="outline" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-[#15397F] text-foreground"
        >
          Next
        </Button>
      </div>
    </div>
  )
} 