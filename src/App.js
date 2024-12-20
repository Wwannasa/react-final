// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import AdminPanel from './AdminPanel';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase-config';
import './App.css';

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={user ? <AdminPanel /> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;