import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/common/Modal';
import { toast } from 'react-toastify';

// Import separated components
import ProfileHeader from '../components/profile/ProfileHeader';
import BMICard from '../components/profile/BMICard';
import PersonalInfoCard from '../components/profile/PersonalInfoCard';
import GoalsCard from '../components/profile/GoalsCard';
import HealthIssuesCard from '../components/profile/HealthIssuesCard';
import EditProfileForm from '../components/profile/EditProfileForm';
import ProfileEmptyState from '../components/profile/ProfileEmptyState';
import Loading from '../components/common/Loading';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    healthIssues: [],
    goals: ''
  });

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  useEffect(() => {
    const getProfileDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log(res.data);
        console.log("id: ", res.data.data._id);
        setProfile(res.data);
        
        // Initialize edit form with profile data
        setEditForm({
          name: res.data.data.name || '',
          email: res.data.data.email || '',
          age: res.data.data.age || '',
          height: res.data.data.height || '',
          weight: res.data.data.weight || '',
          healthIssues: res.data.data.healthIssues || [],
          goals: res.data.data.goals || ''
        });
        
        setLoading(false);
      } catch (error) {
        const serverMessage = error.response?.data?.message;
        toast.error(serverMessage || 'Failed to load profile');
        console.log(error.message);
        setLoading(false);
      }
    };

    getProfileDetails();
  }, []);

  const handleDeleteProfile = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await axios.delete(`${API_URL}api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res.data);
      localStorage.removeItem("token");
      localStorage.clear();
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || 'Failed to delete account');
      console.log(error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHealthIssuesChange = (e) => {
    const value = e.target.value;
    const issuesArray = value.split(',').map(issue => issue.trim()).filter(Boolean);
    setEditForm(prev => ({
      ...prev,
      healthIssues: issuesArray
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const res = await axios.put(`${API_URL}api/user/profile`, editForm, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log('Profile updated:', res.data);
      
      // Update local profile state
      setProfile(res.data);
      toast.success(res.data.message);
      setModalOpen(false);
      
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      toast.error(serverMessage || 'Failed to update profile');
      console.log(error.message);
    }
  };

  if (loading) {
    return <Loading text="your profile" />
  }

  if (!profile) {
    return <ProfileEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <ProfileHeader 
          profile={profile.data}
          onEdit={() => setModalOpen(true)}
          onDelete={handleDeleteProfile}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* BMI Card */}
          <BMICard 
            bmi={profile.data.bmi}
            category={profile.data.bmiCategory}
            height={profile.data.height}
            weight={profile.data.weight}
          />

          {/* Personal Info Card */}
          <PersonalInfoCard 
            age={profile.data.age}
            height={profile.data.height}
            weight={profile.data.weight}
          />

          {/* Goals Card */}
          <GoalsCard goals={profile.data.goals} />

          {/* Health Issues Card */}
          <HealthIssuesCard healthIssues={profile.data.healthIssues} />
        </div>

        {/* Last Updated */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          Last updated: {new Date(profile.data.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Edit Profile">
          <EditProfileForm 
            formData={editForm}
            onInputChange={handleInputChange}
            onHealthIssuesChange={handleHealthIssuesChange}
            onSubmit={handleEditSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default Profile;