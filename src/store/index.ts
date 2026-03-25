import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import { State, Actions } from './types';

// 全局状态
const useStore = create<State & Actions>()(
  persist(
    immer((set, get) => ({
      // ========== 初始状态 ==========
      name: 'John Doe',
      count: 0,
      user: {
        id: '1',
        name: 'John Doe',
        age: 20,
      },
      admin: {
        profile: {
          name: 'Tom',
          settings: {
            theme: 'dark',
            notifications: true
          }
        }
      },
      // ========== 计算属性 ==========
      get isAdmin() {
        return get().user.id === '1';
      },
      get userName() {
        return get().user.name;
      },
      // ========== Actions ==========
      increment: () => {
        // 对象式更新，依赖了state的值，使用get()获取当前状态
        set({
          count: get().count + 1
        })
      },
      decrement: () => {
        // immer 式更新，支持直接修改，无需返回新对象（推荐，最简洁）
        set((state) => {
          state.count -= 1;
        })
      },
      reset: () => {
        // 对象式更新，传入一个对象，即使传入部分状态，会自动合并状态
        set({ count: 0 })
      },
      // 携带参数的action
      setName: (name: string) => {
        set({
          user: {
            ...get().user,
            name
          }
        })
      },
      setAge: (age: number) => {
        // immer 式更新，支持直接修改，无需返回新对象（推荐，最简洁）
        set((state) => {
          state.user.age = age;
        })
      },
      // 组合调用其他action
      setUser: (name: string, age: number) => {
        const { setName, setAge } = get();
        setName(name);
        setAge(age);
      },
      // 接入immer中间件后，可以像操作可变数据一样更新
      updateTheme: (theme: string) => set((state) => {
        state.admin.profile.settings.theme = theme;
      }),
      // 可以轻松处理深层嵌套
      updateNested: (path: string, value: any) => set((state) => {
        const keys = path.split('.');
        let current = state;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i] as keyof typeof current];
        }
        current[keys[keys.length - 1] as keyof typeof current] = value;
      }),

      // 异步操作
      fetchUser: async (userId: string) => {
        // 依赖当前状态判断
        const { user } = get();
        if (user?.id === userId) {
          return;
        }
        // 异步操作
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              name: 'Jack',
              age: 30
            });
          }, 1000);
        });
        set({ user: response as { id: string; name: string; age: number } });
      }
    })
  ), {
    name: 'user-storage',
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => ({ 
      // 选择要持久化的字段
      count: state.count,
      user: state.user 
    })
  }
));

export default useStore;