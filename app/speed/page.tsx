'use client'
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function SpeedTest() {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [ping, setPing] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);
const [testPhase, setTestPhase] = useState<'download' | 'upload'>('download');

const measureUploadSpeed = async () => {
    setTestPhase('upload');
    const testDuration = 5000;
    const startTime = performance.now();
    let totalBytesUploaded = 0;
    let lastUpdate = startTime;
    let lastBytes = 0;
    
    try {
      while (performance.now() - startTime < testDuration) {
        // Create test data (1MB chunks)
        const data = new Uint8Array(1024 * 1024);
        const blob = new Blob([data]);
        
        // Simulate upload using POST request
        const formData = new FormData();
        formData.append('file', blob, 'testfile.dat');
        
        const uploadPromise = fetch('/api/upload-test', {
          method: 'POST',
          body: formData
        });
  
        // Update speed indicator while uploading
        const updateSpeed = () => {
          const now = performance.now();
          const bytesDelta = totalBytesUploaded - lastBytes;
          const timeDelta = (now - lastUpdate) / 1000; // Convert to seconds
  
          if (timeDelta > 0) {
            const currentBps = (bytesDelta * 8) / timeDelta;
            const currentMbps = currentBps / (1024 * 1024);
            setCurrentSpeed(Math.round(currentMbps * 100) / 100);
          }
  
          lastUpdate = now;
          lastBytes = totalBytesUploaded;
        };
  
        // Monitor upload progress
        await uploadPromise;
        totalBytesUploaded += blob.size;
        updateSpeed();
      }
  
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsUploaded = totalBytesUploaded * 8;
      const speedBps = bitsUploaded / durationInSeconds;
      const speedMbps = speedBps / (1024 * 1024);
  
      setUploadSpeed(Math.round(speedMbps * 100) / 100);
    } catch (error) {
      console.error('Error measuring upload speed:', error);
      setUploadSpeed(null);
    } finally {
      setCurrentSpeed(null); // Reset current speed when done
    }
  };
  
  // Add this for download speed measurement as well
  const measureDownloadSpeed = async () => {
    setTestPhase('download');
    const testDuration = 5000;
    const startTime = performance.now();
    let totalBytesReceived = 0;
    let lastUpdate = startTime;
    let lastBytes = 0;
  
    try {
      while (performance.now() - startTime < testDuration) {
        const data = new Uint8Array(1024 * 1024); // 1MB chunk
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
  
        const response = await fetch(url);
        const reader = response.body?.getReader();
  
        if (!reader) throw new Error('Failed to initialize reader');
  
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          totalBytesReceived += value.length;
          
          // Update speed indicator
          const now = performance.now();
          const timeDelta = (now - lastUpdate) / 1000;
          
          if (timeDelta >= 0.1) { // Update every 100ms
            const bytesDelta = totalBytesReceived - lastBytes;
            const currentBps = (bytesDelta * 8) / timeDelta;
            const currentMbps = currentBps / (1024 * 1024);
            setCurrentSpeed(Math.round(currentMbps * 100) / 100);
            
            lastUpdate = now;
            lastBytes = totalBytesReceived;
          }
        }
  
        URL.revokeObjectURL(url);
      }
  
      const endTime = performance.now();
      const durationInSeconds = (endTime - startTime) / 1000;
      const bitsReceived = totalBytesReceived * 8;
      const speedBps = bitsReceived / durationInSeconds;
      const speedMbps = speedBps / (1024 * 1024);
  
      setDownloadSpeed(Math.round(speedMbps * 100) / 100);
    } catch (error) {
      console.error('Error measuring download speed:', error);
      setDownloadSpeed(null);
    } finally {
      setCurrentSpeed(null);
    }
  };

  const measurePing = async () => {
    try {
      const startTime = performance.now();
      await fetch('/api/ping');
      const endTime = performance.now();
      setPing(Math.round(endTime - startTime));
    } catch (error) {
      console.error('Error measuring ping:', error);
      setPing(null);
    }
  };

  const startSpeedTest = async () => {
    setIsTesting(true);
    await measurePing();
    await measureDownloadSpeed();
    await measureUploadSpeed();
    setIsTesting(false);
  };

  
// Add these helper components
const SpeedSuggestion = ({ speed, type }: { speed: number, type: 'download' | 'upload' }) => {
    const getSpeedAnalysis = (speed: number, type: 'download' | 'upload') => {
      if (type === 'download') {
        if (speed >= 100) return { status: 'Excellent', color: 'text-green-600', message: 'Perfect for 4K streaming and heavy downloads' };
        if (speed >= 50) return { status: 'Good', color: 'text-blue-600', message: 'Suitable for HD streaming and gaming' };
        if (speed >= 25) return { status: 'Fair', color: 'text-yellow-600', message: 'Good for basic streaming and browsing' };
        return { status: 'Poor', color: 'text-red-600', message: 'May struggle with streaming and downloads' };
      } else {
        if (speed >= 50) return { status: 'Excellent', color: 'text-green-600', message: 'Perfect for video calls and file uploads' };
        if (speed >= 25) return { status: 'Good', color: 'text-blue-600', message: 'Good for most upload tasks' };
        if (speed >= 10) return { status: 'Fair', color: 'text-yellow-600', message: 'Suitable for basic uploads' };
        return { status: 'Poor', color: 'text-red-600', message: 'May struggle with large file uploads' };
      }
    };
  
    const analysis = getSpeedAnalysis(speed, type);
  
    return (
      <div className="flex items-start space-x-2">
        <div className={`${analysis.color} flex-1`}>
          <p className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)} Speed: {analysis.status}</p>
          <p className="text-sm text-gray-600">{analysis.message}</p>
        </div>
      </div>
    );
  };
  
  const PingAnalysis = ({ ping }: { ping: number }) => {
    const getPingAnalysis = (ping: number) => {
      if (ping < 20) return { status: 'Excellent', color: 'text-green-600', message: 'Perfect for competitive gaming' };
      if (ping < 50) return { status: 'Good', color: 'text-blue-600', message: 'Great for online gaming' };
      if (ping < 100) return { status: 'Fair', color: 'text-yellow-600', message: 'Acceptable for most applications' };
      return { status: 'Poor', color: 'text-red-600', message: 'May experience lag in real-time applications' };
    };
  
    const analysis = getPingAnalysis(ping);
  
    return (
      <div className="flex items-start space-x-2">
        <div className={`${analysis.color} flex-1`}>
          <p className="font-medium">Ping: {analysis.status}</p>
          <p className="text-sm text-gray-600">{analysis.message}</p>
        </div>
      </div>
    );
  };
  

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 py-20"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Speedometer */}
          {isTesting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-8"
            >
              <div className="relative w-64 h-64 mx-auto">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  {/* Outer circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />

                  {/* Speed marks */}
                  {[...Array(11)].map((_, i) => {
                    const rotation = -180 + (i * 180) / 10;
                    const isMainMark = i % 2 === 0;
                    return (
                      <g key={i} transform={`rotate(${rotation} 100 100)`}>
                        <line
                          x1="100"
                          y1="20"
                          x2="100"
                          y2={isMainMark ? "30" : "25"}
                          stroke="#374151"
                          strokeWidth={isMainMark ? "2" : "1"}
                        />
                        {isMainMark && (
                          <text
                            x="100"
                            y="45"
                            textAnchor="middle"
                            fill="#374151"
                            fontSize="12"
                            transform={`rotate(${-rotation} 100 45)`}
                          >
                            {i * 20}
                          </text>
                        )}
                      </g>
                    );
                  })}

                  {/* Speed needle */}
                  <motion.g
                    initial={{ rotate: -180 }}
                    animate={{ 
                      rotate: -180 + ((currentSpeed || 0) / 200) * 180 
                    }}
                    transition={{ type: "spring", stiffness: 50, damping: 10 }}
                    style={{ originX: "100px", originY: "100px" }}
                  >
                    <line
                      x1="100"
                      y1="100"
                      x2="100"
                      y2="30"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="8"
                      fill="#ef4444"
                    />
                  </motion.g>

                  {/* Digital speed display */}
                  <rect
                    x="60"
                    y="130"
                    width="80"
                    height="30"
                    rx="5"
                    fill="#1e293b"
                  />
                  <text
                    x="100"
                    y="152"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="18"
                    fontFamily="monospace"
                  >
                    {Math.round(currentSpeed || 0)}
                  </text>
                  
                  {/* Mbps label */}
                  <text
                    x="100"
                    y="170"
                    textAnchor="middle"
                    fill="#374151"
                    fontSize="14"
                  >
                    Mbps
                  </text>

                  {/* Test type indicator */}
                  <text
                    x="100"
                    y="85"
                    textAnchor="middle"
                    fill="#374151"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {testPhase.toUpperCase()}
                  </text>
                </svg>
              </div>

              {/* Test progress bar */}
              <div className="mt-4 w-64 mx-auto">
                <div className="h-1 w-full bg-gray-200 rounded-full">
                  <motion.div
                    className="h-full bg-blue-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 5, ease: "linear" }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Download</h3>
              <p className="text-3xl font-bold text-blue-600">
                {downloadSpeed ? `${downloadSpeed} Mbps` : '--'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload</h3>
              <p className="text-3xl font-bold text-blue-600">
                {uploadSpeed ? `${uploadSpeed} Mbps` : '--'}
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Ping</h3>
              <p className="text-3xl font-bold text-blue-600">
                {ping ? `${ping} ms` : '--'}
              </p>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={startSpeedTest}
              disabled={isTesting}
              variant="primary"
              size="lg"
              className="w-48"
            >
              {isTesting ? 'Testing...' : 'Start Test'}
            </Button>
          </div>

          {/* Results Analysis */}
          {!isTesting && (downloadSpeed || uploadSpeed) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 p-4 bg-gray-50 rounded-lg"
            >
              <h3 className="font-semibold text-lg mb-3">Connection Analysis</h3>
              <div className="space-y-2">
                {downloadSpeed && (
                  <SpeedSuggestion speed={downloadSpeed} type="download" />
                )}
                {uploadSpeed && (
                  <SpeedSuggestion speed={uploadSpeed} type="upload" />
                )}
                {ping && (
                  <PingAnalysis ping={ping} />
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );

};