import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CartProvider } from "./cart/useCart";
import { AdminLayout } from "./admin/AdminLayout";
import { HomePage } from "./pages/HomePage";
import { MainLayout } from "./pages/MainLayout";
import { DataProvider } from "./utils/data";

function App() {
  return (
    <BrowserRouter>
      <DataProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin" element={<AdminLayout />} />
            <Route path="/admin/*" element={<AdminLayout />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<HomePage menuType="mediodia" />} />
              <Route path="/nocturno" element={<HomePage menuType="nocturno" />} />
            </Route>
          </Routes>
        </CartProvider>
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;
