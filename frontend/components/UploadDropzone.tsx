import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { AnimatedButton } from './AnimatedButton';

interface UploadDropzoneProps {
  onFileAccepted: (file: File) => void;
  error?: string;
}

export function UploadDropzone({ onFileAccepted, error }: UploadDropzoneProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileAccepted(acceptedFiles[0]);
    }
  }, [onFileAccepted]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors focus:outline-none ${
          isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        } ${(isDragReject || error) ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">
          Drag & drop your CSV file here
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          or click to select a file from your computer. Only .csv files are supported.
        </p>
        <div className="mt-6">
          <AnimatedButton type="button" variant="primary">
            Choose File
          </AnimatedButton>
        </div>
      </div>
      {error && (
        <p className="mt-3 text-sm font-medium text-red-600 text-center">{error}</p>
      )}
    </div>
  );
}
