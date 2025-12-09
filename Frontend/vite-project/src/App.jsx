// import ChatWidget from "./components/ChatWidget";

// export default function App() {
//   return (
//     <div className="min-h-screen bg-slate-100 flex items-center justify-center">
//       <h1 className="text-2xl font-bold">
//         Banking Website Demo (AI Helper Widget)
//       </h1>

//       <ChatWidget />
//     </div>
//   );
// }





import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { useContext } from "react";

function PrivateRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
