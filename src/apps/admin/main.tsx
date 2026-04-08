import { createRoot } from "react-dom/client";
import AdminApp from "./App";
import { initializeAppSecurity } from "../web/firebase/config";
import { initObservability } from "../web/services/observabilityService";
import "../../styles/index.css";

initializeAppSecurity();
initObservability();

createRoot(document.getElementById("root")!).render(<AdminApp />);
