import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { breedService } from '../services/api';

const BreedShow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [breed, setBreed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchBreed();
  }, [id]);

  const fetchBreed = async () => {
    setLoading(true);
    setError(null);
    
    const result = await breedService.getBreed(id);
    
    if (result.success) {
      setBreed(result.data);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${breed.name}? This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);
    const result = await breedService.deleteBreed(id);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <p>Loading breed details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h3>Error Loading Breed</h3>
        <p>{error}</p>
        <button onClick={fetchBreed} className="btn btn-primary">
          Try Again
        </button>
        <Link to="/" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    );
  }

  if (!breed) {
    return (
      <div className="text-center">
        <h3>Breed Not Found</h3>
        <p>The breed you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Back to All Breeds
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3">
        <Link to="/" className="btn btn-secondary">
          ← Back to all breeds
        </Link>
      </div>

      <div className="card">
        <h1>{breed.name}</h1>
        <p><strong>Origin:</strong> {breed.origin}</p>
        <p><strong>Size:</strong> {breed.size}</p>
        <p><strong>Lifespan:</strong> {breed.lifespan}</p>
        <p><strong>Temperament:</strong> {breed.temperament}</p>
        
        <h3>Description</h3>
        <p>{breed.description}</p>

        <div className="mt-3">
          <Link
            to={`/breeds/edit/${id}`}
            className="btn btn-primary"
          >
            Edit Breed
          </Link>
          
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="btn btn-danger"
          >
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>

        <div className="mt-3" style={{ fontSize: '12px', color: '#666' }}>
          <p>Created: {new Date(breed.created_at).toLocaleDateString()}</p>
          <p>Last Updated: {new Date(breed.updated_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default BreedShow;
