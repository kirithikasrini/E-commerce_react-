import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, addReviewToProduct, updateProductStock, addOrder } from '../api/dummyJsonAPI';
import {Bounce, toast} from 'react-toastify'

const ProductDetail = ({ addToCart,cart , onProtectedClick}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [addedCart,setAddedCart] = useState(false);
  const [ reviewName,setReviewName] = useState('');
  const [ reviewEmail,setReviewEmail] = useState('');
  const [ reviewComment,setReviewComment] = useState('');
  const [ reviewRating,setReviewRating] = useState('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const result = await fetchProductById(id);
        setProduct(result);
        setMainImage(result.thumbnail || result.images?.[0]);
        const exit = cart?.some(item => item.id === result.id);
        if(exit) 
          setAddedCart(true);
      } catch (error) {
        console.error('Error loading product:', error);
      }
    };

    loadProduct();
  }, [id , cart]);

 const handleAddToCart = () => {
  if (!onProtectedClick()) return;

  if (!addedCart) {
    addToCart({ ...product, quantity });
    toast.success("Added to cart", {
      position: "top-center",
      autoClose: 3000,
      theme: "dark",
      transition: Bounce,
    });
    setAddedCart(true);
  } else {
    navigate('/cart');
  }
};


  if (!product) return <p className="p-10">Loading...</p>;

  const increase = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const decrease = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const newReview = {
      reviewerName: reviewName,
      reviewerEmail: reviewEmail,
      comment: reviewComment,
      rating: parseInt(reviewRating),
      date: new Date().toISOString(),
    };
    try {
      await addReviewToProduct(product.id , newReview);
      const freshProduct = await fetchProductById(product.id);
      setProduct(freshProduct);
      setReviewName('')
      setReviewEmail('');
      setReviewComment('');
      setReviewRating('');
      toast.success("Review Added" , {position: "top-center",autoClose : 2000,closeOnClick:false,pauseOnHover:true,progress:undefined,theme:"dark",transition: Bounce,
    } );
  } catch (error)
  {
    toast.error("Error submitting review",{position: "top-center",autoClose : 2000,closeOnClick:false,pauseOnHover:true,progress:undefined,theme:"dark",transition: Bounce,})
  }
  };
 const handleBuyNow = async () => {
  if (product.stock >= quantity) {
    const newStock = product.stock - quantity;

    try {
      const updated = await updateProductStock(product.id, newStock);
      setProduct(updated);  
      const orderData= {
        productId : product.id,
        title: product.title,
        quantity,
        price : product.price,
        orderDate : new Date().toISOString(),
        shippingDate :  new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) . toISOString()
      };
      await addOrder(orderData)
      toast.success("Order placed successfully!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
        transition: Bounce
      });
      navigate('/order');
    } catch (error) {
      toast.error("Error placing order");
    }
  } else {
    toast.warning("Not enough stock");
  }
};

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        
        
        <div className="md:w-1/2">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full object-contain mb-4 rounded border"
          />
        </div>

        
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>

        
          <div className="flex items-center gap-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
            <span className="text-sm text-gray-600">({product.rating} Rating)</span>
          </div>

          <p className="text-fuchsia-600 font-bold text-xl">${product.price}</p>
          <p className="text-gray-700">{product.description}</p>

          
          <div className="flex items-center gap-4">
            <button onClick={decrease} className="bg-gray-200 px-3 py-1 rounded">-</button>
            <span>{quantity}</span>
            <button onClick={increase} className="bg-gray-200 px-3 py-1 rounded">+</button>
            <span className="text-sm text-gray-500">(Stock: {product.stock})</span>
          </div>

      
          {product.returnPolicy && (
            <div className="bg-purple-50 p-4 rounded shadow-sm border border-purple-300">
              <h3 className="text-lg font-semibold text-purple-700 mb-1">Return Policy</h3>
              <p className="text-gray-700">{product.returnPolicy}</p>
            </div>
          )}

          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {product.warrantyInformation && (
              <div className="bg-blue-50 p-4 rounded shadow-sm border border-blue-300">
                <h3 className="text-lg font-semibold text-blue-700 mb-1">🛡️ Warranty</h3>
                <p className="text-gray-700">{product.warrantyInformation}</p>
              </div>
            )}
            {product.shippingInformation && (
              <div className="bg-green-50 p-4 rounded shadow-sm border border-green-300">
                <h3 className="text-lg font-semibold text-green-700 mb-1">🚚 Shipping:</h3>
                <p className="text-gray-700">{product.shippingInformation}</p>
              </div>
            )}
          </div>

          
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart} 
              className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 transition"
            >
              {addedCart ?"Got To Cart" : "Add to Cart"}
            </button>
            
            <button
              onClick={handleBuyNow}
              className={`bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600 transition ${
              product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              disabled={product.stock === 0}
>
  Buy Now
</button>

          </div>
        </div>
      </div>
      
      <div className="mt-10">
        <h3 className="text-2xl font-semibold mb-4 border-b pb-2">Customer Reviews</h3>
        <div className="mt-10">

  {product.reviews && product.reviews.length > 0 ? (
    product.reviews.map((review, index) => (
      <div key={index} className="bg-white p-4 mb-4 rounded shadow border">
        <div className="flex justify-between mb-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-500">({review.rating}/5)</span>
          </div>
          <span className="text-sm text-gray-400">
            {new Date(review.date).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-700 italic mb-1">"{review.comment}"</p>
        <p className="text-sm text-purple-600">
          👤 {review.reviewerName} | ✉️ {review.reviewerEmail}
        </p>
      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No reviews yet.</p>
  )}
</div>
        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-4 bg-gray-50 p-6 rounded shadow">
        <h4 className="text-xl font-bold">Add Your Review</h4>
        <input type="text" value={reviewName} onChange={(e) => setReviewName(e.target.value)}placeholder="Your Name" className="w-full border px-3 py-2 rounded"required/>
        <input type="email"value={reviewEmail} onChange={(e) => setReviewEmail(e.target.value)} placeholder="Your Email" className="w-full border px-3 py-2 rounded"
    required/>
  <textarea value={reviewComment}onChange={(e) => setReviewComment(e.target.value)} placeholder="Your Comment"className="w-full border px-3 py-2 rounded"required
  />
  <input type="number"
    value={reviewRating}
    onChange={(e) => setReviewRating(e.target.value)}
    placeholder="Rating (1-5)"
    min="1"
    max="5"className="w-full border px-3 py-2 rounded"
    required
  />
  <button type="submit" className="bg-fuchsia-500 text-white px-4 py-2 rounded hover:bg-fuchsia-600">
    Submit Review
  </button>
</form>


       
      </div>
    </div>
  );
};


export default ProductDetail;
