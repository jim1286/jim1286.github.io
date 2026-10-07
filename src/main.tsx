import { documentLocale } from './i18n';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

document.documentElement.lang = documentLocale().tag;
document.documentElement.dir = documentLocale().direction;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
