export interface SubTask {
  _id?: string
  title: string
  isDone: boolean
}

type PriorityType = 'Low' | 'Medium' | 'High'

export interface Task {
  _id: string
  userId: string
  title: string
  content?: string
  isCompleted: boolean
  priority: PriorityType
  dueDate?: string | Date
  subTasks: SubTask[]
  createdAt: string
  updatedAt: string
}

export interface TaskApiResponse<T> {
  message: string
  data: T
}
