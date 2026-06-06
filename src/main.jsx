import React from "react";
import { Toaster } from "sonner";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors />
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
