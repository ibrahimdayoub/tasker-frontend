import Toast from 'react-native-toast-message'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-expo'
import axios from 'axios'
import { Note, NoteApiResponse } from '@/types/note'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL
const API_URL = `${BASE_URL}/notes`

// --- Instance ---

const api = axios.create({
  baseURL: API_URL
})

// --- Axios Instance Functions ---

const createNote = async (noteData: Partial<Note>) => {
  const { data } = await api.post('/', noteData)
  return data
}

const getNotes = async (search?: string) => {
  const { data } = await api.get('/', { params: { search } })
  return data
}

const getArchivedNotes = async () => {
  const { data } = await api.get('/archived')
  return data
}

const togglePin = async (id: string) => {
  const { data } = await api.patch(`/${id}/pin`)
  return data
}

const toggleArchive = async (id: string) => {
  const { data } = await api.patch(`/${id}/archive`)
  return data
}

const duplicateNote = async (id: string) => {
  const { data } = await api.post(`/${id}/duplicate`)
  return data
}

const deleteNote = async (id: string) => {
  const { data } = await api.delete(`/${id}`)
  return data
}

// --- Main Hook ---

export const useNotesApi = () => {
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

  const useCreateNote = () =>
    useMutation<NoteApiResponse<Note>, Error, Partial<Note>>({
      mutationFn: createNote,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notes', userId] })
      }
    })

  const useGetNotes = (search?: string) =>
    useQuery<NoteApiResponse<Note[]>, Error>({
      queryKey: ['notes', userId, search],
      queryFn: () => getNotes(search),
      enabled: !!userId,
      staleTime: search ? 0 : 1000 * 60 * 5
    })

  const useGetArchivedNotes = () =>
    useQuery<NoteApiResponse<Note[]>, Error>({
      queryKey: ['notes-archived', userId],
      queryFn: getArchivedNotes,
      enabled: !!userId
    })

  const useTogglePin = () =>
    useMutation({
      mutationFn: (id: string) => togglePin(id),
      onMutate: async id => {
        await queryClient.cancelQueries({ queryKey: ['notes', userId] })
        const previousNotes = queryClient.getQueryData<NoteApiResponse<Note[]>>(
          ['notes', userId]
        )
        queryClient.setQueryData(['notes', userId], (old: any) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((note: Note) =>
              note._id === id ? { ...note, isPinned: !note.isPinned } : note
            )
          }
        })
        return { previousNotes }
      },
      onError: (err, id, context) => {
        if (context?.previousNotes) {
          queryClient.setQueryData(['notes', userId], context.previousNotes)
        }
        Toast.show({ type: 'error', text1: 'Error', text2: 'Update failed' })
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['notes', userId] })
      }
    })

  const useToggleArchive = () =>
    useMutation({
      mutationFn: (id: string) => toggleArchive(id),
      onMutate: async id => {
        await queryClient.cancelQueries({ queryKey: ['notes', userId] })
        await queryClient.cancelQueries({
          queryKey: ['notes-archived', userId]
        })

        const previousNotes = queryClient.getQueryData(['notes', userId])
        const previousArchived = queryClient.getQueryData([
          'notes-archived',
          userId
        ])

        return { previousNotes, previousArchived }
      },
      onError: (err, id, context) => {
        if (context?.previousNotes)
          queryClient.setQueryData(['notes', userId], context.previousNotes)
        if (context?.previousArchived)
          queryClient.setQueryData(
            ['notes-archived', userId],
            context.previousArchived
          )
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['notes', userId] })
        queryClient.invalidateQueries({ queryKey: ['notes-archived', userId] })
      }
    })

  const useDuplicateNote = () =>
    useMutation({
      mutationFn: (id: string) => duplicateNote(id),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['notes', userId] })
    })

  const useDeleteNote = () =>
    useMutation({
      mutationFn: (id: string) => deleteNote(id),
      onMutate: async id => {
        await queryClient.cancelQueries({ queryKey: ['notes', userId] })
        const previousNotes = queryClient.getQueryData(['notes', userId])
        queryClient.setQueryData(['notes', userId], (old: any) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.filter((n: any) => n._id !== id)
          }
        })
        return { previousNotes }
      },
      onError: (err, id, context) => {
        if (context?.previousNotes) {
          queryClient.setQueryData(['notes', userId], context.previousNotes)
        }
        Toast.show({ type: 'error', text1: 'Error', text2: 'Delete failed' })
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['notes', userId] })
      }
    })

  return {
    useCreateNote,
    useGetNotes,
    useGetArchivedNotes,
    useTogglePin,
    useToggleArchive,
    useDuplicateNote,
    useDeleteNote
  }
}

/**
 * Quick Reference: React Query Mutation Strategies
 * ----------------------------------------------------------------------------
 * 1. Manual Refetch: invalidateQueries() -> Waits for server.
 * 2. Direct Cache Update: setQueryData() with server response -> Faster.
 * 3. Optimistic Update: Update UI BEFORE server call -> Instant feel. (Like Facebook/Instagram)
 * ----------------------------------------------------------------------------
 */
