import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Layout from './components/Layout/Layout';
import Counter from './pages/Counter/Counter';
import Users from './pages/Users/Users';
import { UserProvider } from './context/UserContext';
import MovieDetail from './pages/MovieDetail/MovieDetail';
import Profile from './pages/Profile/Profile';

function App() {
  return (
    <UserProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="counter" element={<Counter />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path="movies/:id" element={<MovieDetail />} />
        </Routes>
      </Layout>
    </UserProvider>
  );
}

export default App;
