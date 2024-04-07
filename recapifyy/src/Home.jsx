import React, { useState, useEffect } from 'react';

function Home() {
  const [user, setCustomerId] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("customerId");
    if(user){
      setCustomerId(user);
    }
  })
  return (
  <div>{user}</div>
  )
}

export default Home;