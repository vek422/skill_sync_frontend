import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "./components/theme-provider";
import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!event) return;
      if (event.key === 'auth_token' && !event.newValue) {
        window.location.href = '/login';
      }
      if (event.key === 'auth_token' && event.newValue) {
        window.location.href = '/dashboard'; // Change if needed
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return (
    <>
      <Provider store={store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>
    </>
  );
}
