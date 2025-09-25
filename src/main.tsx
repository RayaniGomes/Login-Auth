import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import LoginPage from "./pages/login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LoginPage />
  </StrictMode>
);
