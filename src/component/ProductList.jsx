import React, { useEffect, useState } from 'react';
import { fetchAllProducts } from '../api/dummyJsonAPI';
import ProductCard from './ProductCard';
import { useLocation} from 'react-router-dom';  

const ProductList = ({ addToCart, toggleFavorite, favorites, searchTerm , cart }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const Location = useLocation();
  

  useEffect(() => {
    const load = async () => {
      const all = await fetchAllProducts();
      setProducts(all);
      setFiltered(all);

      const tagSet = new Set();
      all.forEach(p => p.tags?.forEach(tag => tagSet.add(tag)));
      setTags([...tagSet]);
    };

    load();
  }, [location.state ?.shouldRefresh]);

  useEffect(() => {
    let temp = products;

    
    if (searchTerm) {
      temp = temp.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    
    if (selectedTags.length > 0) {
      temp = temp.filter(p =>
        p.tags.some(tag => selectedTags.includes(tag))
      );
    }

    setFiltered(temp);
  }, [searchTerm, selectedTags, products]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };



  return (
    <div className="flex p-6 gap-8 items-start">
  
      <div className=" bg-gray-100 p-4 rounded shadow w-fit">
        <h3 className="font-bold text-lg mb-4">Filter by Tags</h3>
        {tags.map(tag => (
          <div key={tag} className="mb-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span className="capitalize">{tag}</span>
            </label>
          </div>
        ))}
      </div>

    
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            addToCart={addToCart}
            toggleFavorite={toggleFavorite} 
            isFavorited={favorites.some(fav => fav.id === product.id)}
            cart = {cart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
