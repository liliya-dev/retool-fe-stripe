"use client"
import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';


interface User {
  id: number;
  name: string;
  surname: string;
  age: string;
  stripeId: string;
  email: string;
}

const UsersScene: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [value, setValue] = useState(20)
  const stripe = useStripe();


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/default/users?page=1&perPage=10`)
      .then(response => response.json())
      .then(data => setUsers(data.users));
  }, []);

  const handlePay = async (user: User) => {
    const response = await fetch('/api', {
      body: JSON.stringify({
        customerId: user.stripeId,
        amount: value
      }),
      method: 'POST',
    });
    const { id } = await response.json();

    await stripe?.redirectToCheckout({ sessionId: id });
  }

  return (
    <div>
      <h1>Users</h1>
      <label htmlFor="amount">Choose an amount to pay:</label>
      <select onChange={(ev) => setValue(+ev.target.value)} style={{ marginLeft: '20px' }} id="amount" value={value}>
        {
          [20, 30, 50, 100].map(item => (
            <option key={item} value={item}>{item}</option>
          ))
        }
      </select>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>{user.name} {user.surname}</p>

            <button style={{ marginLeft: '20px' }} onClick={() => handlePay(user)}>Make payment</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersScene;
