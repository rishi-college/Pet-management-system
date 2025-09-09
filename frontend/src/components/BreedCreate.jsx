import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { breedService } from '../services/api';

const BreedCreate = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    size: '',
    temperament: '',
    lifespan: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

    const result = await breedService.createBreed(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const sizeOptions = ['Small', 'Medium', 'Large', 'Extra Large'];

  return (
    <div>
      <h2 className="text-center mb-3">Add New Dog Breed</h2>
      
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
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Breed'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BreedCreate;
