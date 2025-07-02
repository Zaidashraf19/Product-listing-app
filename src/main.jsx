import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Ecommerce from "./ecommerce.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Ecommerce />
  </StrictMode>
);
