// src/components/TryOnResult.js
'use client';
import Image from 'next/image';


import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

export default function TryOnResult({ resultUrl, isLoading, progress }) {
  return (
    <div className="result-container">
      {isLoading ? (
        <LoadingSpinner progress={progress} />
      ) : resultUrl ? (
        <img 
          src={resultUrl} 
          alt="Try-on Result" 
          className="rounded-lg max-h-[90%] max-w-[90%]" 
        />
      ) : (
        <div className="text-center text-white">
          <p>Your try-on result will appear here</p>
        </div>
      )}
    </div>
  );
}