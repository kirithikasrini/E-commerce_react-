import React from 'react';
import ProductCard from './ProductCard';

const Favorites = ({ favorites, toggleFavorite }) => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Favorites ❤️</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">No favorites added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              toggleFavorite={toggleFavorite}
              isFavorited={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
