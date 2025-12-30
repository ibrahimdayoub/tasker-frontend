export type ColorType = '#ef4444' | '#f97316' | '#3b82f6' | '#22c55e' | '#6b7280'

export interface Note {
  _id: string
  userId: string
  title: string
  content?: string
  color: ColorType
  tags: string[]
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface NoteApiResponse<T> {
  message: string
  data: T
}
