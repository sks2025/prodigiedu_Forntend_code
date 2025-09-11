import React from "react";
import FooterUsers from "./FooterUsers";
import "./UserLogin.css";
import HeaderUser from "./HeaderUser";
import right from "../images/Rectangle 157.png";
import left from "../images/Rectangle 157.png";
import Slider from "./common/Slider";
import Studentheaderhome from "./Studentheaderhome";
import { useGetAllCompetitionsQuery } from '../store/api/apiSlice';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserCard from "./common/UserCard";
// import UserCard from "./UserCard";

const UserLoginpage = ({ title }) => {
  const { data, isLoading, isError } = useGetAllCompetitionsQuery();
  const { competitionsid } = useParams();
  const navigate = useNavigate();
  const [bookmarkedCompetitions, setBookmarkedCompetitions] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

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

  // Fetch bookmarked competitions
  const fetchBookmarkedCompetitions = async () => {
    if (!userId) return;

    setBookmarksLoading(true);
    try {
      const response = await fetch(`https://api.prodigiedu.com/api/competitions/user-bookmarks/${userId}`);
      const result = await response.json();

      if (result.success) {
        // Format bookmarked competitions for display
        const formattedBookmarks = result.competitions.map((comp) => ({
          id: comp._id,
          image: comp.overview?.image
            ? comp.overview.image.startsWith('http')
              ? comp.overview.image
              : `https://api.prodigiedu.com${comp.overview.image}`
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-eE9u3e8kMX7dXfOHkTaaEHLZmZj7muf-fg&s",
          name: comp.overview?.name || "Competition",
          institute: comp.organizerId?.organiserName || "",
          date: comp.overview?.stages?.[0]?.date ? new Date(comp.overview.stages[0].date).toLocaleDateString() : "",
          score: comp.score ? `${comp.score}%` : `${Math.floor(Math.random() * 40) + 50}%`,
          enrollments: comp.enrollments || `${Math.floor(Math.random() * 500) + 100}+`,
          fee: comp.registration?.registration_type?.total_registration_fee ? `₹${comp.registration.registration_type.total_registration_fee}` : "₹850",
        }));
        setBookmarkedCompetitions(formattedBookmarks);
      }
    } catch (error) {
      console.error('Error fetching bookmarked competitions:', error);
    } finally {
      setBookmarksLoading(false);
    }
  };

  // Fetch bookmarked competitions on component mount
  useEffect(() => {
    fetchBookmarkedCompetitions();
  }, [userId]);

  let cards = [];
  if (data && data.competitions) {
    cards = data.competitions.map((comp) => ({
      id: comp._id,
      image: comp.overview?.image
        ? comp.overview.image.startsWith('http')
          ? comp.overview.image
          : `https://api.prodigiedu.com${comp.overview.image}`
        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-eE9u3e8kMX7dXfOHkTaaEHLZmZj7muf-fg&s",
      name: comp.overview?.name || "Competition",
      institute: comp.organizerId?.organiserName || "",
      date: comp.overview?.stages?.[0]?.date ? new Date(comp.overview.stages[0].date).toLocaleDateString() : "",
      score: comp.score ? `${comp.score}%` : "",
      enrollments: comp.enrollments || "",
      fee: comp.registration?.registration_type?.total_registration_fee ? `₹${comp.registration.registration_type.total_registration_fee}` : "",
    }));
  }

  // Remove the default competitions array
  // const competitions = [
  //   {
  //     name: "Competition 1",
  //     daysAway: 90,
  //     progress: 60,
  //   },
  //   {
  //     name: "Competition 2",
  //     daysAway: 100,
  //     progress: 60,
  //   },
  // ];

  const handleCardClick = (id) => {
    navigate(`/Competitionsdetail/${id}`);
  };

  return (
    <>
      <Studentheaderhome />
      <div className="progress-wrapper">
        <img src={left} alt="Top Right" className="corner-img top-right1" />
        <img src={right} alt="Bottom Left" className="corner-img bottom-left1" />

        <h2 style={{ fontWeight: 900 }}>Your Progress</h2>
        <div className=" progress-container">
          <div className="container progress-card-container">
            {/* Render progress cards only if you have real progress data */}
            <div style={{
              textAlign: 'center',
              margin: '1.5rem',
              padding: '1rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              color: '#666',
              fontSize: '18px',
              minHeight: 'unset', // Remove any fixed/min height
              height: 'auto' // Ensure it only takes needed space
            }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>No progress yet</h3>
              <p style={{ margin: 0 }}>Start participating in competitions to see your progress here!</p>
            </div>
          </div>
        </div>
      </div>



      {isLoading ? (
        <div style={{ textAlign: 'center', margin: '2rem' }}>Loading competitions...</div>
      ) : isError ? (
        <div style={{ textAlign: 'center', margin: '2rem', color: 'red' }}>Failed to load competitions.</div>
      ) : (
        <>
          {/* Your Bookmarks Slider - Only show if user is logged in */}
          {userId && (
            bookmarksLoading ? (
              <div style={{ textAlign: 'center', margin: '2rem' }}>Loading your bookmarks...</div>
            ) : bookmarkedCompetitions.length > 0 ? (
              <Slider title="Your Wishlist" cards={bookmarkedCompetitions} onCardClick={handleCardClick}>
                {bookmarkedCompetitions.map((card) => (
                  <UserCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
                  />
                ))}
              </Slider>
            ) : (
              <div style={{
                textAlign: 'center',
                margin: '2rem',
                padding: '2rem',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                color: '#666'
              }}>
                <h3>No Bookmarked Competitions Yet</h3>
                <p>Start bookmarking competitions to see them here!</p>
              </div>
            )
          )}

          {/* Only show sliders if there are competitions */}
          {cards && cards.length > 0 ? (
            <>
              <Slider title="Top Competitions" cards={cards} onCardClick={handleCardClick}>
                {cards.map((card) => (
                  <UserCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
                  />
                ))}
              </Slider>
              <Slider title="Recommended For You" cards={cards} onCardClick={handleCardClick}>
                {cards.map((card) => (
                  <UserCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
                  />
                ))}
              </Slider>
              <Slider title="Latest Competitions" cards={cards} onCardClick={handleCardClick}>
                {cards.map((card) => (
                  <UserCard
                    key={card.id}
                    card={card}
                    onClick={() => handleCardClick(card.id)}
                    onBookmarkChange={fetchBookmarkedCompetitions} // Refresh bookmarks when changed
                  />
                ))}
              </Slider>
            </>
          ) : (
            /* Show a nice message when no competitions are available */
            <div style={{
              textAlign: 'center',
              margin: '3rem 2rem',
              padding: '3rem 2rem',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              border: '2px dashed #dee2e6'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '1rem', color: '#6c757d' }}>🏆</div>
              <h2 style={{ color: '#495057', marginBottom: '1rem', fontSize: '24px' }}>
                No Competitions Available Right Now
              </h2>
              <p style={{ color: '#6c757d', fontSize: '16px', lineHeight: '1.6' }}>
                Check back later for exciting new competitions and opportunities!
              </p>
              <div style={{
                marginTop: '2rem',
                padding: '1rem',
                backgroundColor: '#e9ecef',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#495057'
              }}>
                💡 <strong>Tip:</strong> New competitions are added regularly. Stay tuned!
              </div>
            </div>
          )}
        </>
      )}

      <FooterUsers />
    </>
  );
};

export default UserLoginpage;
