import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { publicRoutes } from "./routes";
import { Fragment } from "react/jsx-runtime";

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Render các route public */}
          {publicRoutes?.map((route, index) => {
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
          {/* Render các route private như các route phía admin */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
