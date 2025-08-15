import React, { useState, useEffect } from 'react'
import "./OrganiserPersonaolsettingpage.css";
import { Edit, Save, X, Trash2, AlertCircle } from 'lucide-react';
import Organisersheader from './Organisersheader';
import OrganiserFooter from './OrganiserFooter';
import { useNavigate } from 'react-router-dom';

const OrganiserPersonaolsettingpage = () => {
  // State management
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initial data structure
  const [profileData, setProfileData] = useState({
    personal: {
      adminName: '',
      mobileNumber: '',
      emailId: '',
      roleInOrganisation: ''
    },
    organisation: {
      orgName: '',
      orgType: '',
      location: '',
      established: ''
    }
  });

  // Tab configuration
  const tabs = [
    { id: 'personal', label: 'Personal Details' },
    { id: 'organisation', label: 'Organisation Details' }
  ];

  // Field configurations
  const fieldConfigs = {
    personal: [
      { key: 'adminName', label: 'Admin Name', type: 'text', required: true },
      { key: 'mobileNumber', label: 'Mobile Number', type: 'tel', required: true },
      { key: 'emailId', label: 'Email ID', type: 'email', required: true },
      { key: 'roleInOrganisation', label: 'Role In Organisation', type: 'text', required: true }
    ],
    organisation: [
      { key: 'orgName', label: 'Org Name', type: 'text', required: true },
      { key: 'orgType', label: 'Org Type', type: 'text', required: true },
      { key: 'location', label: 'Location', type: 'text', required: true },
      { key: 'established', label: 'Established', type: 'text', required: true }
    ]
  };

  // Get organizerId from localStorage
  const userData = JSON.parse(localStorage.getItem("user_Data"));
  const organizerId = userData?._id;
  const navigate = useNavigate();

  // Fetch organiser profile from backend
  useEffect(() => {
    if (!organizerId) return;
    // Example API call, adjust endpoint/fields as needed
    fetch(`https://api.prodigiedu.com/api/organisations/profile/${organizerId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber: userData?.mobileNumber || '' })
    })
      .then(res => res.json())
      .then(result => {
        if (result && result.data) {
          setProfileData({
            personal: {
              adminName: result.data.name || '',
              mobileNumber: result.data.mobileNumber || '',
              emailId: result.data.organiserEmail || '',
              roleInOrganisation: result.data.role || ''
            },
            organisation: {
              orgName: result.data.organiserName || '',
              orgType: result.data.organisationType || '',
              location: result.data.organiserAddress?.cityDistrict || '',
              established: result.data.established || ''
            }
          });
        }
      })
      .catch(err => console.error('Failed to fetch profile', err));
  }, [organizerId]);

  // Handle field changes
  const handleFieldChange = (key, value) => {
    setEditedData(prev => ({
      ...prev,
      [key]: value
    }));
    // Check if there are any changes
    const originalData = profileData[activeTab];
    const hasAnyChanges = Object.keys(originalData).some(
      fieldKey => originalData[fieldKey] !== (key === fieldKey ? value : editedData[fieldKey])
    );
    setHasChanges(hasAnyChanges);
  };

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      setEditedData({});
      setHasChanges(false);
    } else {
      setEditedData({ ...profileData[activeTab] });
    }
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      // Example: send updated data to backend
      const updatedSection = { ...editedData };
      // You may need to adjust the API endpoint and payload structure
      const response = await fetch(`https://api.prodigiedu.com/api/organisations/Updateprofile/${organizerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection)
      });
      const result = await response.json();
      if (response.ok) {
        setProfileData(prev => ({
          ...prev,
          [activeTab]: { ...editedData }
        }));
        setIsEditing(false);
        setEditedData({});
        setHasChanges(false);
        // Optionally show a toast or notification
        console.log('Changes saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete account
  const handleDeleteAccount = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowDeleteConfirm(false);
      // Redirect to logout or home page
      console.log('Account deleted successfully!');
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch all competitions
  const getAllComplete = () => {
    if (!organizerId) return;
    
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch(
        `https://api.prodigiedu.com/api/competitions/getCompetitionsByOrganizerComplete?organizerId=${organizerId}`,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          console.log(result, "dsfgf");
          // Ensure we always set an array to cards state
          if (Array.isArray(result)) {
            setcards(result);
          } else if (result && Array.isArray(result.data)) {
            setcards(result.data);
          } else if (result && Array.isArray(result.competitions)) {
            setcards(result.competitions);
          } else {
            console.warn("API response is not an array:", result);
            setcards([]);
          }
        })
        .catch((error) => {
          console.error(error);
          setcards([]);
        });
    } catch (error) {
      console.log(error);
      setcards([]);
    }
  };

  // On page load
  useEffect(() => {
    if (organizerId) {
      getAllComplete();
    }
  }, [organizerId]);


  // Validate form
  const isFormValid = () => {
    const currentFields = fieldConfigs[activeTab];
    return currentFields.every(field => {
      if (field.required) {
        return editedData[field.key] && editedData[field.key].trim() !== '';
      }
      return true;
    });
  };

  // Render field input
  const renderField = (field) => {
    const currentValue = isEditing ? editedData[field.key] : profileData[activeTab][field.key];
    if (isEditing) {
      return (
        <input
          type={field.type}
          value={currentValue || ''}
          onChange={(e) => handleFieldChange(field.key, e.target.value)}
          className="Organisation-Input"
          placeholder={`Enter ${field.label.toLowerCase()}`}
        />
      );
    }
    // Show placeholder if value is empty
    return <span className="Organisation-Value">{currentValue && currentValue.trim() !== '' ? currentValue : <span style={{color:'#aaa',fontStyle:'italic'}}>Not provided</span>}</span>;
  };

  return (
    <div>
      <Organisersheader/>
      <div className="Organisation-Wrapper">
        <div className="Organisation-Container">
          {/* Sidebar */}
          <div className="Organisation-Sidebar">
            <div>
              <ul className="Organisation-Menu">
                {tabs.map((tab) => (
                  <li
                    key={tab.id}
                    className={`Organisation-MenuItem ${activeTab === tab.id ? 'Organisation-Active' : ''}`}
                    onClick={() => {
                      if (isEditing && hasChanges) {
                        if (window.confirm('You have unsaved changes. Do you want to continue?')) {
                          setIsEditing(false);
                          setEditedData({});
                          setHasChanges(false);
                          setActiveTab(tab.id);
                        }
                      } else {
                        setActiveTab(tab.id);
                      }
                    }}
                  >
                    {tab.label}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="Organisation-SidebarActions">
              <button 
                className="Organisation-DeleteButton"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={loading}
              >
                <Trash2 size={16} />
                Delete Account
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="Organisation-Content">
            <div className="Organisation-Header">
              <h1 className="Organisation-PageTitle">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h1>
              <button
                className={`Organisation-EditButton ${isEditing ? 'Organisation-CancelButton' : ''}`}
                onClick={handleEditToggle}
                disabled={loading}
              >
                {isEditing ? <X size={16} /> : <Edit size={16} />}
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            <div className="Organisation-Card">
              <table className="Organisation-Table">
                <tbody>
                  {fieldConfigs[activeTab].map((field, index) => (
                    <tr key={field.key} className="Organisation-Row">
                      <td className="Organisation-Label">
                        {field.label}
                        {field.required && <span className="Organisation-Required">*</span>}
                      </td>
                      <td className="Organisation-Colon">:</td>
                      <td className="Organisation-ValueCell">
                        {renderField(field)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isEditing && (
              <div className="Organisation-Actions">
                <button
                  className={`Organisation-SaveButton ${!hasChanges || !isFormValid() ? 'Organisation-SaveButtonDisabled' : ''}`}
                  onClick={handleSaveChanges}
                  disabled={!hasChanges || !isFormValid() || loading}
                >
                  {loading ? (
                    <span className="Organisation-Loading">Saving...</span>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="Organisation-ModalOverlay">
          <div className="Organisation-Modal">
            <div className="Organisation-ModalHeader">
              <AlertCircle size={24} className="Organisation-ModalIcon" />
              <h3>Delete Account</h3>
            </div>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <div className="Organisation-ModalActions">
              <button
                className="Organisation-ModalCancelButton"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="Organisation-ModalDeleteButton"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <OrganiserFooter/>
    </div>
  )
}

export default OrganiserPersonaolsettingpage