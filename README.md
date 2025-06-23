# Project README

## 📖 Overview

This repository contains the **frontend** application for the LangGraph-based AI-powered skill assessment platform. It is built with **Vite**, **React**, **TypeScript**, and uses **shadcn/ui** for UI components. The code is structured and documented so that an AI agent can parse this README to generate or extend code modules, pages, and components automatically.

### 🚀 Goals

- Provide clear guidelines for folder layout, naming conventions, and coding standards.
- Define flows for two roles: **Recruiter** and **Candidate**.
- Enable AI-driven code generation based on consistent patterns.

---

## 🗂️ Folder Structure

```
src/
│
├── components/           # Shared and role-specific reusable UI components
│   ├── recruiter/        # Components unique to recruiter pages
│   ├── candidate/        # Components unique to candidate pages
│   └── shared/           # Common components (Button, Card, Input)
│
├── pages/                # Route-based page components
│   ├── recruiter/        # /recruiter routes
│   │   ├── Dashboard.tsx
│   │   ├── TestCreate.tsx
│   │   ├── TestEdit.tsx
│   │   └── Report.tsx
│   └── candidate/        # /candidate routes
│       ├── Assessment.tsx
│       └── Chatbot.tsx
│
├── routes/               # Layout and routing wrappers
│   └── ProtectedRoutes.tsx
│
├── store/                # Global state managers (Redux slices)
│   ├── authStore.ts      # Authentication and user info
│   ├── testStore.ts      # Test and graph state
│   └── chatStore.ts      # Chatbot interaction state
│
├── utils/                # Utility functions and helpers
│   ├── api.ts            # API client (mock or real)
│   └── graphHelpers.ts   # Skill-graph manipulation helpers
│
└── lib/
    └── langgraphClient.ts  # Functions to call LangGraph AI services
```

---

## 🛠️ Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run in development**

   ```bash
   npm run dev
   ```

3. **Build for production**

   ```bash
   npm run build
   ```

4. **Preview production build**

   ```bash
   npm run preview
   ```

---

## 💡 Coding Guidelines

### 1. **File & Folder Naming**

- Use **PascalCase** for React components (`MyComponent.tsx`).
- Use **camelCase** for hooks, utility functions (`useAuth.ts`, `fetchTests`).
- Folder names are **lowercase** and plural where appropriate (`components`, `utils`).

### 2. **Component Structure**

- Each component file exports a **single default** React component.
- Follow the pattern:

  ```tsx
  import React from "react";
  import { Button } from "@/components/shared/Button";

  interface Props {
    /* prop definitions */
  }

  const MyComponent: React.FC<Props> = (
    {
      /* destructure props */
    }
  ) => {
    return <div className="p-4 rounded-2xl shadow">{/* JSX markup */}</div>;
  };

  export default MyComponent;
  ```

### 3. **UI Library Usage (shadcn/ui)**

- Import only needed components:

  ```ts
  import { Card, CardContent } from "@/components/shared/Card";
  ```

- Use Tailwind utility classes for layout and spacing.
- Prefer `Card`, `Button`, `Input`, `Dropdown`, and `Dialog` for common UIs.

### 4. **State Management (Redux Toolkit)**

- We use **@reduxjs/toolkit** for predictable and scalable global state.

- Organize state via **slices**, each with its own reducer and actions.

- Configure the store in `src/store/index.ts`:

  ```ts
  import { configureStore } from "@reduxjs/toolkit";
  import authReducer from "./authSlice";
  import testReducer from "./testSlice";
  import chatReducer from "./chatSlice";

  export const store = configureStore({
    reducer: {
      auth: authReducer,
      test: testReducer,
      chat: chatReducer,
    },
  });

  export type RootState = ReturnType<typeof store.getState>;
  export type AppDispatch = typeof store.dispatch;
  ```

- Example **`authSlice.ts`**:

  ```ts
  import { createSlice, PayloadAction } from "@reduxjs/toolkit";

  interface AuthState {
    user: User | null;
    token: string;
  }

  const initialState: AuthState = {
    user: null,
    token: "",
  };

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      setUser(state, action: PayloadAction<User>) {
        state.user = action.payload;
      },
      logout(state) {
        state.user = null;
        state.token = "";
      },
    },
  });

  export const { setUser, logout } = authSlice.actions;
  export default authSlice.reducer;
  ```

### 5. **Routing & Layout** **Routing & Layout**

- Use **React Router** with nested routes.
- Wrap protected routes in `ProtectedRoutes.tsx` that checks `authStore` for role.
- Example:

  ```tsx
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/recruiter" element={<ProtectedRoutes role="recruiter" />}>
      <Route index element={<Dashboard />} />
      <Route path="test/create" element={<TestCreate />} />
      {/* more routes */}
    </Route>
    {/* candidate routes similarly */}
  </Routes>
  ```

### 6. **API Contracts (Mock First)**

- Define TypeScript interfaces for backend responses:

  ```ts
  interface SkillNode {
    id: string;
    name: string;
    children: SkillNode[];
  }
  interface Test {
    id: string;
    name: string;
    graph: SkillNode[];
  }
  interface MCQ {
    id: string;
    question: string;
    options: string[];
    answer: number;
  }
  ```

- Implement `api.ts` with placeholder `Promise.resolve(mockData)` to simulate.

---

## 🤖 AI Agent Integration

This README is formatted so an AI agent can:

1. **Parse folder structure** to know where to generate files.
2. **Follow naming conventions** for new components and stores.
3. **Use code patterns** for components, stores, and routes.
4. **Generate mocks** in `lib/langgraphClient.ts` to simulate AI responses.
5. **Extend pages** by copying patterns in `pages/recruiter` and `pages/candidate`.

### Example AI Instruction:

> "Create a new recruiter page: `TestSummary.tsx` under `pages/recruiter`. Use `Card` from shared components and fetch test details via `useTestStore`. Follow component structure patterns."

---

## ✅ Contribution & Testing

- Write unit tests with **Vitest** under `src/__tests__/`.
- Use React Testing Library for component tests.
- Lint with **ESLint** and format with **Prettier**.

---

_Last updated: June 23, 2025_
