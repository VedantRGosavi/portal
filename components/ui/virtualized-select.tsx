import * as React from 'react'
import { FixedSizeList as List } from 'react-window'
import { Input } from './input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select'

interface VirtualizedSelectProps {
  value: string
  onValueChange: (value: string) => void
  searchValue: string
  onSearchChange: (value: string) => void
  options: string[]
  placeholder?: string
}

const ITEM_HEIGHT = 35
const ITEMS_IN_VIEW = 6

export function VirtualizedSelect({
  value,
  onValueChange,
  searchValue,
  onSearchChange,
  options,
  placeholder,
}: VirtualizedSelectProps) {
  const Row = React.useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => (
      <SelectItem
        key={options[index]}
        value={options[index]}
        className="text-white hover:bg-[#005CB9] hover:text-[#FFDA00]"
        style={style}
      >
        {options[index]}
      </SelectItem>
    ),
    [options]
  )

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="bg-zinc-900 border-[#005CB9] text-white">
        <SelectValue>
          {value || placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="bg-black border-[#005CB9] relative">
        <div className="sticky top-0 z-10 bg-black p-2 border-b border-[#005CB9]">
          <Input
            placeholder="Search schools..."
            className="bg-zinc-900 border-[#005CB9] text-white"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="pt-1">
          <List
            height={Math.min(options.length * ITEM_HEIGHT, ITEMS_IN_VIEW * ITEM_HEIGHT)}
            itemCount={options.length}
            itemSize={ITEM_HEIGHT}
            width="100%"
          >
            {Row}
          </List>
        </div>
      </SelectContent>
    </Select>
  )
} 