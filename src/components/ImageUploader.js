// src/components/ImageUploader.js
'use client';
import Image from 'next/image';


import { useState, useRef } from 'react';
import { fileToBase64 } from '../lib/utils';

export default function ImageUploader({ label, onImageChange }) {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Create URL for preview
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      // Convert to base64 for API
      const base64 = await fileToBase64(file);
      onImageChange(base64);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image');
    }
  };
  
  const handleClick = () => {
    fileInputRef.current.click();
  };
  
  const handleDrop = async (e) => {
    e.preventDefault();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      try {
        // Create URL for preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        
        // Convert to base64 for API
        const base64 = await fileToBase64(file);
        onImageChange(base64);
      } catch (error) {
        console.error('Error processing dropped image:', error);
        alert('Failed to process image');
      }
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  return (
    <div 
      className="image-uploader"
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      
      {preview ? (
        <img src={preview} alt="Preview" className="image-preview" />
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <p className="mt-2">{label}</p>
          <p className="text-sm text-gray-500">Paste/drop image here OR choose file</p>
        </>
      )}
    </div>
  );
}