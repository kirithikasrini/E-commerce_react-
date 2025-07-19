
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/products';
const ORDER_URL = "http://localhost:5000/orders";
const USER_URL = "http://localhost:5000/users";



export const fetchAllProducts = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};
export const addNewProduct = async (product) => {
  const response = await axios.post(BASE_URL, product);
  return response.data;
};

export const addReviewToProduct = async (productId, newReview) => {
  const product = await fetchProductById(productId);
  const updatedReviews = [...(product.reviews || []), newReview];

  const response = await axios.patch(`${BASE_URL}/${productId}`, {
    reviews: updatedReviews
  });

  return response.data;
};


export const updateProductStock = async (id, newStock) => {
  const response = await axios.patch(`${BASE_URL}/${id}`, {
    stock: newStock
  });
  return response.data;
};

export const addOrder = async (order) => {
  
  const product = await fetchProductById(order.productId);

  const shippingInfo = product.shippingInformation ;
  const shippingDays = extractShippingDays(shippingInfo); 

  const shippingDate = new Date();
  const orderDate = new Date();
  shippingDate.setDate(orderDate.getDate() + shippingDays);

  const enrichedOrder = {
    ...order,
    title: product.title,
    thumbnail: product.thumbnail,
    shippingInformation: shippingInfo,
    orderDate: orderDate.toISOString(),
    shippingDate: shippingDate.toISOString(),
  };

  const response = await axios.post(ORDER_URL, enrichedOrder);
  return response.data;
};


const extractShippingDays = (info) => {
  const match = info.match(/(\d+)/); 
  const number = match ? parseInt(match[1]) : 0;

  if (info.includes("week")) return number * 7;
  if (info.includes("day")) return number;
  if (info.includes("month")) return number * 30;
  return 0; 
};


export const fetchAllOrders = async () => {
  const response = await axios.get(ORDER_URL);
  return response.data;
};


export const loginUser = async (email, password) => {
  const response = await axios.get(`${USER_URL}?email=${email}&password=${password}`);
  
  if (response.data.length > 0) {
    return response.data[0]; 
  } else {
    throw new Error('Invalid email or password');
  }
};



