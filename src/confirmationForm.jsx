// ConfirmationForm.jsx
import React, { useState } from 'react';

function ConfirmationForm() {
  // State variables to hold form input values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [assetMaterialNo, setAssetMaterialNo] = useState('');
  const [image, setImage] = useState(null); // State for the selected file
  const [remarks, setRemarks] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default browser form submission
    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    const submissionData = new FormData();
    submissionData.append('name', name);
    submissionData.append('phone', phone);
    submissionData.append('assetMaterialNo', assetMaterialNo);
    submissionData.append('remarks', remarks);
    if (image) {
      submissionData.append('image', image); // 'image' should match multer field name in backend
    }

    try {
      // Use environment variable for the API base URL
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}/api/confirmations`;
     const response = await fetch(apiUrl, {
        method: 'POST',
        body: submissionData, // FormData will set Content-Type to multipart/form-data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit confirmation.');
      }

      setSuccessMessage(result.message || 'Confirmation submitted successfully!');
      console.log("Data saved:", result.data);

      // Reset form fields
      setName('');
      setPhone('');
      setAssetMaterialNo('');
      setImage(null);
      if (document.getElementById('image')) {
        document.getElementById('image').value = '';
      }
      setRemarks('');
    } catch (e) {
      console.error("Error adding document or uploading image: ", e);
      if (e instanceof TypeError && e.message === 'Failed to fetch') {
        setError('Could not connect to the server. Please ensure it is running and try again.');
      } else {
        setError('Failed to submit confirmation. Please try again. ' + e.message);
      }
    } finally {
      setIsLoading(false);
    }

  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Confirmation Details</h2>

        {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">{successMessage}</div>}
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">{error}</div>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-semibold mb-2">Enter Your name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required // Make this field required
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="phone" className="block text-gray-700 text-sm font-semibold mb-2">Enter your phone no:</label>
          <input
            type="tel" // Use type="tel" for phone numbers
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required // Make this field required
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="assetMaterialNo" className="block text-gray-700 text-sm font-semibold mb-2">Enter Asset/Material no:</label>
          <input
            type="text"
            id="assetMaterialNo"
            value={assetMaterialNo}
            onChange={(e) => setAssetMaterialNo(e.target.value)}
            required // Make this field required
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-semibold mb-2">Upload image:</label>
          <input
            type="file"
            id="image"
            accept="image/*" // Suggest accepting image files
            onChange={(e) => setImage(e.target.files[0])} // Get the first selected file
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="remarks" className="block text-gray-700 text-sm font-semibold mb-2">Remarks:</label>
          <textarea
            id="remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <input
          type="submit"
          value={isLoading ? "Submitting..." : "Confirm"}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline transition duration-150 ease-in-out cursor-pointer disabled:opacity-50"
        />
      </form>
    </div>
  );
}

export default ConfirmationForm;
