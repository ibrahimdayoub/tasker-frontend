import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-expo'
import axios from 'axios'
import { Task, TaskApiResponse } from '@/types/task'
;[]
const BASE_URL = process.env.EXPO_PUBLIC_API_URL
const API_URL = `${BASE_URL}/tasks`

// --- Instance ---

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
})

// --- Axios Instance Functions ---

const createTask = async (taskData: Partial<Task>) => {
  const { data } = await api.post('/', taskData)
  return data
}

const getTasks = async () => {
  const { data } = await api.get('/')
  return data
}

const getTask = async (id: string) => {
  const { data } = await api.get(`/${id}`)
  return data
}

const toggleTaskStatus = async (id: string) => {
  const { data } = await api.patch(`/${id}/toggle`)
  return data
}

const deleteTask = async (id: string) => {
  const { data } = await api.delete(`/${id}`)
  return data
}

const toggleSubtaskStatus = async ({
  taskId,
  subId
}: {
  taskId: string
  subId: string
}) => {
  const { data } = await api.patch(`/${taskId}/subtasks/${subId}/toggle`)
  return data
}

// --- Main Hook ---

export const useTasksApi = () => {
  const queryClient = useQueryClient()
  const { getToken, userId } = useAuth()

  // --- Interceptor ---

  api.interceptors.request.use(
    async config => {
      const token = await getToken()
      if (!token) {
        const source = axios.CancelToken.source()
        config.cancelToken = source.token
        source.cancel('No authentication token found')
        return config
      }
      config.headers.Authorization = `Bearer ${token}`
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // --- React Query Hooks ---

  const useCreateTask = () =>
    useMutation<TaskApiResponse<Task>, Error, Partial<Task>>({
      mutationFn: createTask,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] })
    })

  const useGetTasks = () =>
    useQuery<TaskApiResponse<Task[]>, Error>({
      queryKey: ['tasks', userId],
      queryFn: getTasks,
      enabled: !!userId
    })

  const useGetTask = (id: string) =>
    useQuery<TaskApiResponse<Task>, Error>({
      queryKey: ['task', id],
      queryFn: () => getTask(id),
      enabled: !!id && !!userId
    })

  const useToggleTaskStatus = () =>
    useMutation<TaskApiResponse<Task>, Error, { id: string }>({
      mutationFn: ({ id }) => toggleTaskStatus(id),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.setQueryData(['task', variables.id], res)
      }
    })

  const useDeleteTask = () =>
    useMutation<TaskApiResponse<null>, Error, { id: string }>({
      mutationFn: ({ id }) => deleteTask(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        queryClient.invalidateQueries({ queryKey: ['task-stats'] })
      }
    })

  const useToggleSubtaskStatus = () =>
    useMutation<
      TaskApiResponse<Task>,
      Error,
      { taskId: string; subId: string }
    >({
      mutationFn: toggleSubtaskStatus,
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ['tasks'] })
        // Manual Refetch
        // queryClient.invalidateQueries({ queryKey: ['task', variables.taskId] })
        // Direct Cache Update
        queryClient.setQueryData(['task', variables.taskId], res)
      }
    })

  return {
    useCreateTask,
    useGetTasks,
    useGetTask,
    useToggleTaskStatus,
    useDeleteTask,
    useToggleSubtaskStatus
  }
}
