// AdminPanel.js
import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebase-config';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [editProductId, setEditProductId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const batch = writeBatch(db);

      const productList = productSnapshot.docs.map((doc) => {
        const data = doc.data();
        if (!data.updatedAt) {
          batch.update(doc.ref, { updatedAt: serverTimestamp() });
        }
        return { id: doc.id, ...data };
      });

      await batch.commit();
      setProducts(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (name && price && description) {
      try {
        await addDoc(collection(db, 'products'), {
          name,
          price,
          description,
          updatedAt: serverTimestamp(),
          userId: auth.currentUser.uid,
        });
        fetchProducts();
        setName('');
        setPrice('');
        setDescription('');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (name && price && description && editProductId) {
      try {
        await updateDoc(doc(db, 'products', editProductId), {
          name,
          price,
          description,
          updatedAt: serverTimestamp(),
        });
        fetchProducts();
        setName('');
        setPrice('');
        setDescription('');
        setEditProductId(null);
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h1 className="admin-title">Admin Panel</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </header>

      <form onSubmit={editProductId ? handleUpdateProduct : handleAddProduct} className="product-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="product-input"
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="product-input"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="product-textarea"
        />
        <button type="submit" className="product-button">{editProductId ? 'Update' : 'Add'} Product</button>
      </form>

      <ul className="product-list">
        {products.map((product) => (
          <li key={product.id} className="product-item">
            <h3>{product.name}</h3>
            <p>Price: {product.price}</p>
            <p>{product.description}</p>
            <p><strong>Updated At:</strong> {formatDate(product.updatedAt)}</p>
            <button onClick={() => {
              setName(product.name);
              setPrice(product.price);
              setDescription(product.description);
              setEditProductId(product.id);
            }} className="edit-button">Edit</button>
            <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
