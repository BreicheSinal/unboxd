import { createRoot } from "react-dom/client";
import App from "./apps/web/App.tsx";
import { initializeAppSecurity } from "./apps/web/firebase/config";
import { initObservability } from "./apps/web/services/observabilityService";
import "./styles/index.css";

initializeAppSecurity();
initObservability();

createRoot(document.getElementById("root")!).render(<App />);
