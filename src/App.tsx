import { BrowserRouter, Routes, Route } from 'react-router';
import Layout from "./Layout";
import Home from './components/Home/home';
import Profile from './components/Profile/profile';
import "./App.css";
import Books from './components/Admin/Books/Books';
import Read from './components/Admin/Read/Read';
import ProtectedAdminRoute from './hooks/ProtectedAdminRoute';
import News from './components/Admin/News/News';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element= {<ProtectedAdminRoute />}>
            <Route path="books" element={<Books />} />
            <Route path="read" element={<Read />} />
            <Route path="news" element={<News />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;