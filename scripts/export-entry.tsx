import { createRoot } from "react-dom/client";
import { DepthProvider } from "../src/lib/depth-context";
import Home from "../src/app/page";

const container = document.getElementById("__export_root")!;
const root = createRoot(container);
root.render(
  <DepthProvider>
    <Home />
  </DepthProvider>,
);
