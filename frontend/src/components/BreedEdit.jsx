import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { breedService } from '../services/api';

const BreedEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    size: '',
    temperament: '',
    lifespan: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBreed();
  }, [id]);

  const fetchBreed = async () => {
    setInitialLoading(true);
    setError(null);
    
    const result = await breedService.getBreed(id);
    
    if (result.success) {
      setFormData(result.data);
    } else {
      setError(result.error);
    }
    
    setInitialLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await breedService.updateBreed(id, formData);
    
    if (result.success) {
      navigate(`/breeds/${id}`);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];

  if (initialLoading) {
    return (
      <div className="loading">
        <p>Loading breed details...</p>
      </div>
    );
  }

  if (error && !formData.name) {
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

  return (
    <div>
      <h2 className="text-center mb-3">Edit {formData.name}</h2>
      
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Breed Name *
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="e.g., Golden Retriever"
          />
        </div>

        <div className="form-group">
          <label htmlFor="origin" className="form-label">
            Origin *
          </label>
          <input
            type="text"
            name="origin"
            id="origin"
            value={formData.origin}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="e.g., Scotland"
          />
        </div>

        <div className="form-group">
          <label htmlFor="size" className="form-label">
            Size *
          </label>
          <select
            name="size"
            id="size"
            value={formData.size}
            onChange={handleChange}
            required
            className="form-control"
          >
            <option value="">Select size</option>
            {sizeOptions.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="temperament" className="form-label">
            Temperament *
          </label>
          <input
            type="text"
            name="temperament"
            id="temperament"
            value={formData.temperament}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="e.g., Friendly, Intelligent, Devoted"
          />
        </div>

        <div className="form-group">
          <label htmlFor="lifespan" className="form-label">
            Lifespan *
          </label>
          <input
            type="text"
            name="lifespan"
            id="lifespan"
            value={formData.lifespan}
            onChange={handleChange}
            required
            className="form-control"
            placeholder="e.g., 10-12 years"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description *
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="form-control"
            placeholder="Describe the breed's characteristics, history, and notable features..."
          />
        </div>

        <div className="text-center">
          <Link
            to={`/breeds/${id}`}
            className="btn btn-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BreedEdit;
