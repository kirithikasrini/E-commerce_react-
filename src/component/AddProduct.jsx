import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addNewProduct } from '../api/dummyJsonAPI';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    rating: '',
    stock: '',
    tags: '',
    thumbnail: '',
    images: '',
    shippingInformation: '',
    warrantyInformation: '',
    availabilityStatus: '',
    reviews: [],
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: parseFloat(formData.rating),
      stock: parseInt(formData.stock),
      tags: formData.tags.split(',').map(tag => tag.trim()),
      images: formData.images.split(',').map(img => img.trim()),
    };

    await addNewProduct(productData);

    
    navigate('/', { state: { shouldRefresh: true } });
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <label>Title:
          <input name="title" value={formData.title} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </label>

        <label>Description:
          <input name="description" value={formData.description} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </label>

        <label>Category:
          <input name="category" value={formData.category} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </label>

        <label>Price:
          <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </label>

        <label>Rating:
          <input name="rating" type="number" value={formData.rating} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </label>

        <label>Stock:
          <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </label>

        <label>Tags:
          <input name="tags" value={formData.tags} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </label>

        <label>Thumbnail URL:
          <input name="thumbnail" value={formData.thumbnail} onChange={handleChange} className="w-full border px-3 py-2 rounded" required />
        </label>

        <label>Images:
          <input name="images" value={formData.images} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </label>

        <label>Shipping Info:
          <input name="shippingInformation" value={formData.shippingInformation} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </label>

        <label>Warranty Info:
          <input name="warrantyInformation" value={formData.warrantyInformation} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
        </label>

        <label>Availability:
          <select name="availabilityStatus" value={formData.availabilityStatus} onChange={handleChange} className="w-full border px-3 py-2 rounded">
            <option value="">Select Availability</option>
            <option value="In Stock">In Stock</option>
            <option value="LowStock">Out of Stock</option>
          </select>
        </label>

        <button type="submit" className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 transition center-block">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
