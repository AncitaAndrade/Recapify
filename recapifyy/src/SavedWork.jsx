import React, { useState, useEffect } from 'react';

function SavedWork() {
  const [customerId, setCustomerId] = useState(null);
  const [recaps, setRecaps] = useState([]);
  const url = "http://recapify.us-east-2.elasticbeanstalk.com/";

  useEffect(() => {
    const Id = localStorage.getItem("customerId");
    if (Id) {
      setCustomerId(Id);
    }
  }, []); 

  useEffect(() => {
    if (customerId) {
      fetchData();
    }
  }, [customerId]);

  const fetchData = async () => {
    try {
      console.log(customerId)
      const response = await fetch(url + '/allRecaps/'+customerId, {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setRecaps(data); // Store fetched data in state
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteRecap = async (recapId) => {
    try {
      // Call API to delete the recap item
      // Replace 'DELETE' with the actual HTTP method used for deletion in your API
      const response = await fetch(`${url}/deleteRecap/${recapId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete recap');
      }
      // Remove the deleted recap from the recaps state
      setRecaps(recaps.filter(recap => recap.id !== recapId));
    } catch (error) {
      console.error('Error deleting recap:', error);
    }
  };

  const handleRecapClick = async (fileName) => {
    try {
      console.log(fileName)
      await fetch(`${url}/getSummary/${fileName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recap details. Status: ' + response.status);
        }
        return response.json();
      })
      .then((detailedData) => {
        console.log('Detailed data:', detailedData);
      })
      .catch((error) => {
        console.error('Error fetching recap details:', error);
      });
    }
    catch{
      throw new Error('Failed to fetch recap details.')
    }
  }

  return (
    <div className="saved-work-container">
      <ul className="saved-work-list">
        {recaps.map(recap => (
          <li key={recap.filename} className="saved-work-item" onClick={() => handleRecapClick(recap.filename)}>
            {recap.heading}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SavedWork;
