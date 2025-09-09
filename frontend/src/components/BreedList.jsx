import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { breedService } from '../services/api';

const BreedList = () => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBreeds();
  }, []);

  const fetchBreeds = async () => {
    setLoading(true);
    setError(null);
    
    const result = await breedService.getAllBreeds();
    
    if (result.success) {
      setBreeds(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const filteredBreeds = breeds.filter(breed =>
    breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    breed.temperament.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading">
        <p>Loading breeds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error Loading Breeds</h3>
        <p>{error}</p>
        <button onClick={fetchBreeds} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center mb-3">Dog Breeds Database</h2>
      
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search breeds..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
        />
      </div>

      <p className="text-center mb-3">
        Showing {filteredBreeds.length} of {breeds.length} breeds
      </p>

      {filteredBreeds.length === 0 ? (
        <div className="text-center">
          <p>No breeds found matching your search.</p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn btn-secondary"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredBreeds.map(breed => (
            <div key={breed.id} className="card">
              <h3>{breed.name}</h3>
              <p><strong>Origin:</strong> {breed.origin}</p>
              <p><strong>Size:</strong> {breed.size}</p>
              <p><strong>Lifespan:</strong> {breed.lifespan}</p>
              <p><strong>Temperament:</strong> {breed.temperament}</p>
              <p>{breed.description}</p>
              <Link to={`/breeds/${breed.id}`} className="btn btn-primary">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BreedList;
