import Home from "./pages/Home"
import Navbar from './components/Navbar'
import Admin from "./pages/Admin"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Catalogues from "./pages/Catalogues"
import { PopupProvider } from "./context/PopupContext"
import TopProduct from "./pages/TopProduct"
import NewArrivals from "./pages/NewArrivals"
import Featured from "./pages/Featured"
import Blog from "./pages/Blog"
import BlogDetail from "./pages/BlogDetail"
import CatalogueDetail from "./pages/CatalogueDetail"
import PrivacyPolicy from "./utils/PrivacyPolicy"

function App() {

  return (
    <BrowserRouter>
      <PopupProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogues />} />
          <Route path="/catalogue/:id" element={<CatalogueDetail />} />
          <Route path="/top-products" element={<TopProduct />} />
          <Route path="/new-products" element={<NewArrivals />} />
          <Route path="/featured-products" element={<Featured />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </PopupProvider>
    </BrowserRouter>
  )
}

export default App
