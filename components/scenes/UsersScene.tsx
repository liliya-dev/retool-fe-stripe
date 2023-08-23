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
      }),
      method: 'POST',
    });
    const { id } = await response.json();

    await stripe?.redirectToCheckout({ sessionId: id });
  }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <p>{user.name} {user.surname}</p>
            <button onClick={() => handlePay(user)}>Make payment</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersScene;
