import React, { useState, useEffect } from 'react';
import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";
import './UserCardSlider.css';

const UserCard = ({ card, onClick, onBookmarkChange }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // Get user ID from localStorage
  const getUserId = () => {
    try {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser.id;
      }
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const userId = getUserId();

  // Check bookmark status on component mount
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!userId || !card.id) return;

      try {
        const response = await fetch(`https://api.prodigiedu.com/api/competitions/bookmark/check?userId=${userId}&competitionId=${card.id}`);
        const result = await response.json();
        if (result.success) {
          setIsBookmarked(result.isBookmarked);
        }
      } catch (error) {
        console.error('Error checking bookmark status:', error);
      }
    };

    checkBookmarkStatus();
  }, [card.id, userId]);

  // Handle bookmark toggle
  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); // Prevent card click when clicking bookmark

    if (!userId) {
      alert('Please login to bookmark competitions');
      return;
    }

    setIsBookmarkLoading(true);

    try {
      const url = 'https://api.prodigiedu.com/api/competitions/bookmark';
      const method = isBookmarked ? 'DELETE' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          competitionId: card.id
        })
      });

      const result = await response.json();

      if (result.success) {
        setIsBookmarked(!isBookmarked);
        // Call the refresh function if provided
        if (onBookmarkChange) {
          onBookmarkChange();
        }
      } else {
        console.error('Bookmark operation failed:', result.message);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  return (
    <div className="user-card" style={{ minWidth: '24rem', cursor: 'pointer', position: 'relative' }} onClick={onClick}>
      <div className="user-card-image-container">
        <img
          src={card.image}
          alt={card.name}
          className="user-card-image"
        />
        {/* Bookmark Icon */}
        <div
          className="bookmark-icon-slider"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            transition: "all 0.2s ease",
            border: "1px solid rgba(0, 0, 0, 0.1)"
          }}
          onClick={handleBookmarkClick}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)";
          }}
          title={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          {isBookmarkLoading ? (
            <div style={{
              fontSize: "14px",
              color: "#666",
              animation: "spin 1s linear infinite"
            }}>⋯</div>
          ) : isBookmarked ? (
            <IoBookmark style={{
              fontSize: "18px",
              color: "#1a7f37",
              filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))"
            }} />
          ) : (
            <IoBookmarkOutline
              className="bookmark-outline-slider"
              style={{
                fontSize: "18px",
                color: "#666",
                transition: "color 0.2s ease"
              }}
            />
          )}
        </div>
      </div>
      <div className="user-card-content">
        <h2 className="user-card-name">{card.name}</h2>
        <p className="user-card-institute">{card.institute}</p>
        <div className="user-card-details" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
          {/* Row 1: Date | Similarity Score */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>
              <span className="user-card-label" style={{ color: '#888', fontWeight: 400 }}>Date: </span>
              <span className="user-card-value" style={{ fontWeight: 700 }}>{card.date}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="user-card-label" style={{ color: '#888', fontWeight: 400 }}>Similarity Score</span>
              <span className="user-card-badge mt-3" style={{ background: '#e6f4ea', color: '#1a7f37', borderRadius: '8px', padding: '2px 16px', fontWeight: 700, fontSize: '1rem', minWidth: '48px', textAlign: 'center', display: 'inline-block' }}>{card.score || '97%'}</span>
            </span>
          </div>
          {/* Row 2: Subjects | Registration Fee */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <span>
              <span className="user-card-label" style={{ color: '#888', fontWeight: 400 }}>Subjects: </span>
              <span className="user-card-value" style={{ fontWeight: 700 }}>{card.subjects ? card.subjects.join(', ') : (card.subject || 'Maths')}</span>
            </span>
            <span>
              <span className="user-card-label" style={{ color: '#888', fontWeight: 400 }}>Registration fee : </span>
              <span className="user-card-value" style={{ fontWeight: 700 }}>{card.fee || '₹150'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
