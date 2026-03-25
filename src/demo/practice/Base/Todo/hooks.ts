import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Toast } from 'antd-mobile'
import type { Todo } from './index'

let todoList: Todo[] = [
  { id: 1, text: 'Todo 1', completed: false, isEditing: false }
]

// 查询所有 todos
const getTodos = () => {
  return new Promise((resolve) => {
    console.log('getTodosSuccess')
    setTimeout(() => {
      resolve(todoList)
    }, 1000)
  })
}
export const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
    staleTime: 0, // 支持设置缓存
    refetchOnWindowFocus: true, // 窗口聚焦时重新请求
    refetchInterval: 10 * 1000, // 每10秒自动更新一次
    refetchOnReconnect: true, // 重新连接时重新请求
    retry: 3, // 支持重试
    initialData: [] // 初始数据
  })
}

// 创建 todo
const createTodo = async (todo: Todo): Promise<Todo> => {
  const data: Todo = await new Promise((resolve) => {
    setTimeout(() => {
      todoList = [...todoList, todo];
      resolve(todo)
    }, 3000)
  })
  return data
}
export const useCreateTodo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: createTodo,
    // 支持乐观更新
    onMutate: async (newTodo) => {
      console.log('onMutate', newTodo)
      // 1. 取消正在进行的查询，避免覆盖乐观更新
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      // 2. 保存当前缓存数据（用于回滚）
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      // 3. 乐观更新：立即将新数据添加到缓存
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
        return [...old, newTodo]
      })
      // 4. 返回上下文，用于失败时回滚
      return { previousTodos }
    },
    onSuccess: (newTodo) => {
      console.log('newTodo', newTodo)
      // 方式1：使缓存失效，重新获取
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      
      // 方式2：直接更新缓存（推荐，性能更好）
      // queryClient.setQueryData<Todo[]>(['todos'], (old = []) => [...old, newTodo])
      
      // Toast.show({ content: '创建成功' })
    },
    onError: (error, variables, context) => {
      // 失败时回滚到之前的数据
      if (context?.previousTodos) {
        queryClient.setQueryData(['todos'], context.previousTodos)
      }
      // Toast.show({ content: '创建失败' })
    },
    onSettled: () => {
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
      console.log(queryClient.getQueryData<Todo[]>(['todos']))
    },
  })
}

// 更新 todo
const updateTodo = async ({ id, ...updates }: Partial<Todo> & { id: number }): Promise<Todo> => {
  const data: Todo = await new Promise((resolve) => {
    setTimeout(() => {
      todoList = todoList.map(v => {
        if (v.id === id) {
          return { ...v, ...updates }
        }
        return v;
      })
      resolve({ id, ...updates })
    }, 1500)
  })
  return data
}
export const useUpdateTodo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: updateTodo,
    onMutate: async ({ id, ...updates }) => {
      // 1. 取消正在进行的查询，避免覆盖乐观更新
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      // 2. 保存当前缓存数据（用于回滚）
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      // 3. 乐观更新：立即将新数据添加到缓存
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
        return old.map(todo => todo.id === id ? { ...todo, ...updates } : todo)
      })
      // 4. 返回上下文，用于失败时回滚
      return { previousTodos }
    },
    onSuccess: (updatedTodo) => {
      // 更新缓存中的对应项
      // queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
      //   return old.map(todo => 
      //     todo.id === updatedTodo.id ? updatedTodo : todo
      //   )
      // })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      // Toast.show('更新成功')
    },
  })
}

// 删除 todo
const deleteTodo = async (id: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(() => {
      todoList = todoList.filter(v => v.id != id);
      resolve({ id })
    }, 1500)
  })
}
export const useDeleteTodo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (_, deletedId) => {
      // 从缓存中移除
      // queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
      //   return old.filter(todo => todo.id !== deletedId)
      // })
      queryClient.invalidateQueries({ queryKey: ['todos'] })
      // Toast.show('删除成功')
    },
    // 支持乐观更新
    onMutate: async (deletedId) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: ['todos'] })
      
      // 保存之前的数据
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      
      // 乐观更新
      queryClient.setQueryData<Todo[]>(['todos'], (old = []) => {
        return old.filter(todo => todo.id !== deletedId)
      })
      
      // 返回上下文，用于回滚
      return { previousTodos }
    },
    onError: (err, deletedId, context) => {
      // 回滚
      queryClient.setQueryData(['todos'], context?.previousTodos)
      Toast.show('删除失败')
    },
  })
}