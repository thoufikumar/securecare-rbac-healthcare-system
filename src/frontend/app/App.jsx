// src/frontend/app/App.jsx
// Root application component – mounts the router and provides Global Auth Context.

import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "../../backend/modules/auth/useAuth";
import router from "./routes";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
