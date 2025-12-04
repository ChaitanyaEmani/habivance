import React from 'react';
import { User, Mail, Calendar } from 'lucide-react';

const ProfileHeader = ({ profile, onEdit, onDelete }) => {
  return (
    <div className="bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-2xl shadow-xl p-8 mb-6 gap-4">
      <div className="flex items-center space-x-6">
        <div className="bg-blue-700 rounded-full p-4 w-24 h-24 flex items-center justify-center flex-shrink-0">
          <User className="w-12 h-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800">{profile.name}</h1>
          <div className="flex items-center text-gray-600 mt-2">
            <Mail className="w-4 h-4 mr-2" />
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center text-gray-500 mt-1 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Member since {new Date(profile.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
      <div className='flex gap-2 flex-wrap'>
        <button 
          onClick={onEdit} 
          className='bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-md transition-colors'
        >
          Edit Profile
        </button>
        <button 
          className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors' 
          onClick={onDelete}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;