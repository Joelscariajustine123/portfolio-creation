import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image, FileText, FolderOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropZoneProps {
  onFileSelect: (files: File[]) => void;
  accept: Record<string, string[]>;
  maxFiles?: number;
  category: 'profile' | 'resume' | 'project';
  disabled?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({
  onFileSelect,
  accept,
  maxFiles = 1,
  category,
  disabled = false
}) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles);
    }
    setIsDragActive(false);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  const getIcon = () => {
    switch (category) {
      case 'profile':
        return <Image className="h-12 w-12 text-muted-foreground" />;
      case 'resume':
        return <FileText className="h-12 w-12 text-muted-foreground" />;
      case 'project':
        return <FolderOpen className="h-12 w-12 text-muted-foreground" />;
      default:
        return <Upload className="h-12 w-12 text-muted-foreground" />;
    }
  };

  const getDescription = () => {
    switch (category) {
      case 'profile':
        return 'Drop your profile picture here, or click to select';
      case 'resume':
        return 'Drop your resume PDF here, or click to select';
      case 'project':
        return 'Drop project images here, or click to select';
      default:
        return 'Drop files here, or click to select';
    }
  };

  const getFileTypes = () => {
    switch (category) {
      case 'profile':
        return 'JPG, PNG, WebP up to 5MB';
      case 'resume':
        return 'PDF up to 10MB';
      case 'project':
        return 'JPG, PNG, WebP up to 5MB each';
      default:
        return '';
    }
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300",
        "hover:border-primary hover:bg-primary/5",
        isDragActive && "border-primary bg-primary/10 shadow-glow",
        isDragReject && "border-destructive bg-destructive/10",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "transition-transform duration-300",
          isDragActive && "scale-110"
        )}>
          {getIcon()}
        </div>
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-foreground">
            {getDescription()}
          </p>
          <p className="text-sm text-muted-foreground">
            {getFileTypes()}
          </p>
        </div>

        {isDragReject && (
          <p className="text-sm text-destructive">
            Invalid file type. Please check the requirements above.
          </p>
        )}
      </div>
    </div>
  );
};