import { useState, useEffect } from 'react';
import { API_BASE_URL } from './util';
import { Link } from 'react-router-dom';
import DogCard from './DogCard';

interface Dog {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
}


const FavoriteList: React.FC<{ favorites: string[]; toggleFavorite: (id: string) => void }> = ({ favorites, toggleFavorite }) => {
  const [favoriteDogs, setFavoriteDogs] = useState<Dog[]>([]);
  const [match, setMatch] = useState<Dog | null>();

  useEffect(() => {
    if (favorites.length > 0) {
      fetch(`${API_BASE_URL}/dogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favorites),
        credentials: "include",
      })
        .then(res => res.json())
        .then(setFavoriteDogs);
    } else {
      setFavoriteDogs([]);
    }
  }, [favorites]);

  const fetchDogDetails = async (dogIds: string[]) => {
    const response = await fetch(`${API_BASE_URL}/dogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dogIds),
      credentials: "include",
    });
    return response.ok ? response.json() : [];
  };

  const findMatch = async () => {
    if (favorites.length === 0) return;
    const response = await fetch(`${API_BASE_URL}/dogs/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(favorites),
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      const dogDetails = await fetchDogDetails([data.match]);
      setMatch(dogDetails[0]);
    }
  };

  return (
    <div>
      <h2>Favorite Dogs</h2>
      <div className="favorite-dog-button-group">
        <Link className="view-favorite-button" to="/search">Back to Search</Link>
        {favorites.length > 0 && <div className="view-favorite-button" onClick={findMatch}>Find Best Match</div>}
      </div>
      <ul>
        {favoriteDogs.map(dog => (
          <div key={dog.id}>
            <DogCard dogObject={dog} favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        ))}
      </ul>


      {match && (
        <div  className='match-overlay-container'>
          <div className='match-overlay-content'>
            <h3>Your Best Match</h3>
            <img src={match.img} alt={match.name} width="100" />
            <p>{match.name} ({match.breed}) - Age: {match.age}</p>
            <div className="view-favorite-button" onClick={() => setMatch(null)}>Close</div>
          </div>
        </div>
      )}
    </div>
  );
};


export default FavoriteList;