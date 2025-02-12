import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./component/Login";
import DogSearch from "./component/DogSearch";
import FavoriteList from "./component/FavoriteList";
import './App.css';


type UserInfo = { name: string; email: string };

const App: React.FC = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', email: '' });
  
  const [fetchedDogs, setFetchedDogs] = useState<any[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]);
  };

  return (
    <div className="app-container">
            
      <div className="app-header">
        <h1>Dog Search🐶</h1>
       
      </div>
      <Router>
        <Routes>
          <Route path="/" element={authenticated ? <Navigate to="/search" /> : <Login onLogin={() => setAuthenticated(true)} setUserInfo={setUserInfo} />} />
          <Route path="/search" element={authenticated ?
            <DogSearch 
            fetchedDogs={fetchedDogs}
            setFetchedDogs={setFetchedDogs}
            userInfo={userInfo} onLogout={() => setAuthenticated(false)} favorites={favorites} toggleFavorite={toggleFavorite} />
            : <Navigate to="/" />} />
          <Route path="/favorites" element={authenticated ? <FavoriteList favorites={favorites} toggleFavorite={toggleFavorite} /> : <Navigate to="/" />} />

        </Routes>
      </Router>

      <div className="app-footer">
        <span>© {new Date().getFullYear()} Xingjian Wang. All rights reserved.</span>
      </div>
    </div>
  );
};

export default App;
