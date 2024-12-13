import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { loginRoutes, privateRoutes } from "./routes";
import { Fragment } from "react/jsx-runtime";
import ProtectedRoute from "./components/ProtectedRoute";
// Import the ProtectedRoute component

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Login */}
          {loginRoutes?.map((route, index) => {
            const Layout = route.layout || Fragment;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <route.component />
                  </Layout>
                }
              />
            );
          })}

          {/* Protect all private routes */}
          {privateRoutes?.map((route, index) => {
            const Layout = route.layout || Fragment;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <ProtectedRoute>
                    {" "}
                    {/* Wrap all private routes with ProtectedRoute */}
                    <Layout>
                      <route.component />
                    </Layout>
                  </ProtectedRoute>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
