import { ColorType } from '@/types/note'

export const NOTESCOLORS: ColorType[] = [
  '#ef4444',
  '#f97316',
  '#3b82f6',
  '#22c55e',
  '#6b7280'
]

export const getPriorityColor = (p: string) => {
  switch (p) {
    case 'High':
      return '#ef4444'
    case 'Medium':
      return '#4f46e5'
    case 'Low':
      return '#6b7280'
    default:
      return '#6b7280'
  }
}
