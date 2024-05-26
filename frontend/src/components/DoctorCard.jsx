import React from 'react';

function DoctorCard({ doctor }) {
  const { Name, Specialty, Location, Profile_URL } = doctor;

  return (
    <div className="w-[350px] mx-auto flex flex-col gap-2 p-4 bg-white shadow-lg rounded-lg overflow-hidden transition duration-300 hover:shadow-xl">
        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{Name}</h3>
        <p className="bg-blue-200 text-gray-600 py-2 px-4 w-fit mb-2">{Specialty}</p>
        <p className="text text-gray-600 mb-4">{Location}</p>
        <a href={Profile_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">View Profile</a>
    </div>
  );
}

export default DoctorCard;
