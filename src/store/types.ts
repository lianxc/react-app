export interface State {
  count: number;
  user: {
    id: string;
    name: string;
    age: number;
  };
  name: string;
  admin: {
    profile: {
      name: string;
      settings: {
        theme: string;
        notifications: boolean;
      };
    };
  };
}

export interface Actions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setName: (name: string) => void;
  setAge: (age: number) => void;
  updateTheme: (theme: string) => void;
  updateNested: (path: string, value: any) => void;
}