import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeView from "./views/HomeView";
import RegisterView from "./views/RegisterView";
import LoginView from "./views/LoginView";
import MoviesView from "./views/MoviesView";
import GenreView from "./views/GenreView"
import DetailView from "./views/DetailView";
import SettingsView from "./views/SettingsView";
import CartView from "./views/CartView";
import SearchView from "./views/SearchView";
import './App.css'
import ErrorView from "./views/ErrorView";
import { StoreProvider } from "./context/context";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/cart" element={<CartView />} />
          <Route path="/settings" element={<SettingsView />} />
          <Route path="/movies" element={<MoviesView />}>
            <Route path="genre/:genre_id" element={<GenreView />} />
            <Route path="details/:id" element={<DetailView />} />
            <Route path="search" element={<SearchView />} />
          </Route>
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App