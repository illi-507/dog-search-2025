import {useState, useEffect} from 'react';
import { API_BASE_URL } from './util';
import { Link } from 'react-router-dom';
import DogCard from './DogCard';

const DogSearch: React.FC<{
    fetchedDogs: any[],
    setFetchedDogs: React.Dispatch<React.SetStateAction<any[]>>,  
    onLogout: () => void; userInfo: { name: string, email: string };
    favorites: string[];
    toggleFavorite: (id: string) => void
  }> = ({ onLogout, favorites, userInfo, toggleFavorite,setFetchedDogs,fetchedDogs }) => {
    const [dogs, setDogs] = useState<any[]>([]);
    const [breeds, setBreeds] = useState<string[]>([]);
    const [selectedBreed, setSelectedBreed] = useState("");
    const [zipCodes, setZipCodes] = useState<string[]>([]);
    const [ageMin, setAgeMin] = useState<number | "">("");
    const [ageMax, setAgeMax] = useState<number | "">("");
    const [sortField, setSortField] = useState<string>("breed");
    const [sortOrder, setSortOrder] = useState<string>("asc");
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [size, setSize] = useState<string>('25');
    const [pageInput, setPageInput] = useState<string>("");
    const dogsPerPage = 10;
    useEffect(() => {
      fetch(`${API_BASE_URL}/dogs/breeds`, {
        method: "GET",
        credentials: "include",
      })
        .then(res => res.json())
        .then((breedData: string[]) => setBreeds(breedData))
        .finally(() => setLoading(false));
    }, []);
  
  
    const fetchDogDetails = async (dogIds: string[]) => {
      const chunkSize = 100;
      const dogDetails: any[] = [];
  
      const chunks = Array.from({ length: Math.ceil(dogIds.length / chunkSize) }, (_, index) =>
        dogIds.slice(index * chunkSize, (index + 1) * chunkSize)
      );
  
      for (const chunk of chunks) {
        try {
          const response = await fetch(`${API_BASE_URL}/dogs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chunk),
            credentials: "include",
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch dog details');
          }
  
          const dogs = await response.json();
          dogDetails.push(...dogs);
  
        } catch (error) {
          console.error("Error fetching dog details:", error);
        }
      }
  
      return dogDetails; 
    };
  
    
    const fetchDogs = async () => {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (selectedBreed) queryParams.append("breeds", selectedBreed);
      if (zipCodes.length > 0) queryParams.append("zipCodes", zipCodes.join(","));
      if (ageMin !== "") queryParams.append("ageMin", ageMin.toString());
      if (ageMax !== "") queryParams.append("ageMax", ageMax.toString());
      queryParams.append("size", size.toString());
      queryParams.append("sort", `${sortField}:${sortOrder}`);
  
      try {
        let url = `${API_BASE_URL}/dogs/search?${queryParams.toString()}`;
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
  
        if (!response.ok) throw new Error("Failed to fetch dogs");
  
        const { resultIds } = await response.json();  
        if (!resultIds || resultIds.length === 0) {
          setDogs([]);
          setFetchedDogs([]);
          setLoading(false);
          return;
        }
  
        const dogDetails = await fetchDogDetails(resultIds);
        setDogs(dogDetails);
        setFetchedDogs(dogDetails);
      } catch (error) {
        console.error("Error fetching dogs:", error);
        setDogs([]);
        setFetchedDogs([]);
      } finally {
        setLoading(false);
      }
    };
  
    const handlePageChange = () => {
      const pageNumber = parseInt(pageInput, 10);
      if (!isNaN(pageNumber) && pageNumber > 0) {
        setCurrentPage(pageNumber);
      }
    };
  
    if(dogs.length === 0){
      if(fetchedDogs.length > 0){
        setDogs(fetchedDogs)
      }
      
    }
    return (
      <div className="dog-search-container">
        <div className="dog-search-header">
          <div className="user-name">Hello,
            <span style={{ color:"#2e86de"}}>  {userInfo.name}</span></div>
          <Link className="view-favorite-button" to="/favorites">❤️View Favorites</Link>
          <div className="logout-button" onClick={onLogout}>Logout</div>
        </div>
  
        <div className="dog-search-content-container">
          <div className="dog-search-option-container" >
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", alignItems: "center", rowGap: "10px" }}>
              <label>Breed:</label>
              <select onChange={(e) => setSelectedBreed(e.target.value)} value={selectedBreed}>
                <option value="">All Breeds</option>
                {breeds.sort().map(breed => (
                  <option key={breed} value={breed}>{breed}</option>
                ))}
              </select>
  
              <label>Zip Codes:</label>
              <input
                type="text"
                placeholder="Comma separated zip codes"
                onBlur={(e) => setZipCodes(e.target.value.split(",").map(z => z.trim()))}
              />
  
              <label>Age Min:</label>
              <input
                type="number"
                value={ageMin}
                onChange={(e) => setAgeMin(e.target.value ? parseInt(e.target.value) : "")}
              />
  
              <label>Age Max:</label>
              <input
                type="number"
                value={ageMax}
                onChange={(e) => setAgeMax(e.target.value ? parseInt(e.target.value) : "")}
              />
  
              <label>Size:</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value || "25")}
              />
  
              <label>Sort By:</label>
              <select value={sortField} onChange={(e) => setSortField(e.target.value)}>
                <option value="breed">Breed</option>
                <option value="name">Name</option>
                <option value="age">Age</option>
              </select>
  
              <label>Order:</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
  
            <button className="search-button" onClick={fetchDogs} style={{ marginTop: "10px", padding: "8px", fontSize: "16px" }}>
              Search
            </button>
            <button className="search-button" onClick={()=>{
               setDogs([]);
               setFetchedDogs([]);
               setLoading(false);
            }} style={{ marginTop: "10px", padding: "8px", fontSize: "16px" }}>
              Clear Search
            </button>
          </div>
  
  
          <div className="dog-search-result-container">
            
            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
              </div>
            ) : (
              <>
               
                {dogs.length === 0 ?
                  <div className='welcome-container'>
                      <h3>Edit your search options and start a search...</h3>
                  </div>:
                  <>
                   <h2 style={{marginLeft: "40px"}}>Results</h2>
                    <ul>
                      {dogs.slice((currentPage - 1) * dogsPerPage, currentPage * dogsPerPage).map(dog => (
                        <div key={dog.id}>
  
                          <DogCard dogObject={dog} favorites={favorites} toggleFavorite={toggleFavorite} />
  
                        </div>
                      ))}
                    </ul>
                    <div className="pagination">
                      <span  style={{padding:"3px"}}>Page {currentPage} of {Math.ceil(dogs.length / dogsPerPage)}</span>
                      <input
                        type="text"
                        value={pageInput}
                        onChange={(e) => setPageInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handlePageChange()}
                        placeholder="Go to page"
                      />
                      <div className="view-favorite-button" onClick={handlePageChange}>Go</div>
                    </div>
                  </>
                }
              </>
            )}
          </div>
        </div>
  
      </div>
    );
  };

  export default DogSearch;
  