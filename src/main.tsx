import { documentLocale } from './i18n';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
// HJM 1.27 bundles Pretendard; the profile keeps HJM's default ui stack, so loading the
// face once here makes every device render it instead of whatever font is installed.
import "@hjmds/react/fonts/pretendard.css";

document.documentElement.lang = documentLocale().tag;
document.documentElement.dir = documentLocale().direction;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
