import React, { useState, useEffect } from 'react';
import { ListItem, ListItemText, IconButton, ListItemSecondaryAction } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';

function SavedWork() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [recaps, setRecaps] = useState([]);
  const [popupData, setPopupData] = useState(null);
  const [title, setTitle] = useState(null);
  const [open, setOpen] = useState(false);

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
      setRecaps(data); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTitle(null);
    setPopupData(null);
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

  const handleCopyToClipboard = () => {
    if (popupData) {
      navigator.clipboard.writeText(popupData)
        .then(() => {
          console.log('Content copied to clipboard:', popupData);
        })
        .catch(error => {
          console.error('Error copying content to clipboard:', error);
        });
    }
  };

  const handleRecapClick = async (recap) => {
    try {
      await fetch(`${url}/getSummary/${recap.filename}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch recap details. Status: ' + response.status);
        }
        return response.json();
      })
      .then((detailedData) => {
        setPopupData(detailedData);
        setOpen(true);
        setTitle(recap.heading)
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
        <li key={recap.filename}>
        <ListItem
          className="saved-work-item"
          onMouseEnter={() => setHoveredItem(recap)}
          onMouseLeave={() => setHoveredItem(null)}
          onClick={() => handleRecapClick(recap)}
        >
          <ListItemText primary={recap.heading} />
          {hoveredItem === recap && (
            <ListItemSecondaryAction>
              <IconButton onClick={() => handleDeleteRecap(recap)} edge="end">
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      </li>
      ))}
    </ul>
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Summary of {title}
        </Typography>
      </DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Typography variant="body1" sx={{ fontSize: '18px' }}>{popupData}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleCopyToClipboard} sx={{ backgroundColor: '#F9D5D5', color: 'black' }}>
            Copy to Clipboard
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SavedWork;
