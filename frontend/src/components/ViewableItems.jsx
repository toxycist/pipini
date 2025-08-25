import { useState } from 'react'

import './ViewableItems.css'

export function ViewableItems() {
  const [viewCounters, setViewCounters] = useState({
    1: 0,
    2: 0,
    3: 0,
  });

  const viewItem = (id) => {
    setViewCounters((prev) => ({
      ...prev,
      [id]: prev[id] + 1,
    }));
  };

return(
    <div className='viewable-items-container'>
      {Object.entries(viewCounters).map(([itemId, value]) => (
        <div key={itemId}  className='viewable-item'>
          <button
            className="clickable-button"
            onClick={() => {viewItem(itemId)}}>View item {itemId}</button>
          <div>Item viewed {value} times.</div>
        </div>
      ))}
    </div>
  )}