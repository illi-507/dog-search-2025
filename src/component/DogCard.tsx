type DogType = {
  age: number,
  breed: string,
  img: string,
  name: string,
  zip_code: string,
  id: string,
}

type DogCardProps = {
  dogObject: DogType,
  favorites?: string[],
  toggleFavorite?: (id: string) => void

}

const DogCard: React.FC<DogCardProps> = ({ dogObject, favorites, toggleFavorite }): JSX.Element => {
  const dog = dogObject;

  return <div className="dog-card-container">
    <div className="dog-image">
      <img src={dog.img} alt={dog.name} width="100%" />
    </div>
    <div className="dog-info-container">
      <div className="dog-name">{dog.name}</div>
      <div className="dog-breed">Breed: {dog.breed}</div>
      <div className="dog-age">Age: {dog.age}</div>
      <div className="dog-zipcode">Age: {dog.zip_code}</div>
      
      {toggleFavorite &&<button className="dog-favorite-button" onClick={() => toggleFavorite(dog.id)}>
        {favorites &&favorites.includes(dog.id) ? "Unfavorite" : "Favorite"}
      </button>}
    </div>
  </div>
}

export default DogCard;