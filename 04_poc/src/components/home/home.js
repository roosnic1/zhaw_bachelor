import React from 'react';
import { Link } from 'react-router';

const Orders = () => {
  return (
    <div className="home">
      <h1>Imagine Cargo</h1>
      <ul>
        <li><Link to="/orders">Order</Link></li>
      </ul>
    </div>
  );
};

export default Orders;
