// src/app/page.js
'use client';

import { useState, useEffect } from 'react';
import ImageUploader from '../components/ImageUploader';
import ParameterToggles from '../components/ParameterToggles';
import TryOnResult from '../components/TryOnResult';
import { initializeTryOnTask, pollTaskStatus } from '../lib/api';

export default function Home() {
  const [modelImage, setModelImage] = useState(null);
  const [garmentImage, setGarmentImage] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [apiToken, setApiToken] = useState('fa-FvnTXPgvoYo5-4v6W9fr1s44K5gbXAjDfrkiI');
  
  // Default API parameters
  const [parameters, setParameters] = useState({
    garment_photo_type: 'auto',
    category: 'auto',
    segmentation_free: false,
    mode: 'balanced', // Can be 'performance', 'balanced', or 'quality'
  });

  // Load API token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('fashionAiToken');
    if (savedToken) {
      setApiToken(savedToken);
    }
  }, []);

  const handleApiTokenChange = (e) => {
    const token = e.target.value;
    setApiToken(token);
    localStorage.setItem('fashionAiToken', token);
  };
  
  const handleTryOn = async () => {
    if (!modelImage || !garmentImage) {
      setError('Please upload both model and garment images');
      return;
    }
    
    if (!apiToken) {
      setError('Please enter your Fashion AI API token');
      return;
    }
    
    setIsLoading(true);
    setProgress(0);
    setError(null);
    setResultUrl(null);
    
    try {
      // Prepare API payload
      const payload = {
        model_image: modelImage,
        garment_image: garmentImage,
        moderation_level: 'permissive',
        mode: parameters.mode,
        ...parameters
      };
      
      // Start try-on task
      const taskId = await initializeTryOnTask(payload, apiToken);
      console.log('Task initialized:', taskId);
      
      // Poll for results
      let taskComplete = false;
      while (!taskComplete) {
        const statusResult = await pollTaskStatus(taskId, apiToken);
        setProgress(statusResult.progress);
        
        if (statusResult.status === 'completed') {
          setResultUrl(statusResult.url);
          taskComplete = true;
        }
        
        // Add a small delay between polls
        await new Promise(r => setTimeout(r, 2000));
      }
    } catch (err) {
      console.error('Try-on failed:', err);
      setError(err.message || 'Try-on process failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-6xl">
      <div className="mb-6">
        <label className="block mb-2">Fashion AI API Token:</label>
        <input
          type="password"
          value={apiToken}
          onChange={handleApiTokenChange}
          placeholder="Enter your API token"
          className="w-full p-2 border rounded mb-4"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-3">Select Model</h2>
          <ImageUploader 
            label="Upload Model" 
            onImageChange={base64 => setModelImage(base64)} 
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Select Garment</h2>
          <ImageUploader 
            label="Upload Garment" 
            onImageChange={base64 => setGarmentImage(base64)} 
          />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-3">Result</h2>
          <TryOnResult 
            resultUrl={resultUrl} 
            isLoading={isLoading} 
            progress={progress} 
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Parameters</h2>
        <ParameterToggles 
          parameters={parameters} 
          onChange={setParameters} 
        />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4">
          {error}
        </div>
      )}
      
      <div className="flex justify-center mt-6">
        <button
          onClick={handleTryOn}
          disabled={isLoading || !modelImage || !garmentImage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded disabled:opacity-50"
        >
          {isLoading ? 'Processing...' : 'Try On'}
        </button>
      </div>
      
      <div className="text-center mt-8 text-sm text-gray-500">
        <p>Watch <a href="#" className="text-blue-500">2-Minute Tutorial</a> to learn more</p>
      </div>
    </div>
  );
}