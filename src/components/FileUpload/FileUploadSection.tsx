import React, { useState } from 'react';
import { FileData } from '@/hooks/useFileManager';
import { DropZone } from './DropZone';
import { FilePreview } from './FilePreview';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploadSectionProps {
  title: string;
  description: string;
  category: 'profile' | 'resume' | 'project';
  files: FileData[];
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (fileId: string) => void;
  onReplace: (file: File, fileId?: string) => Promise<void>;
  maxFiles?: number;
  isUploading?: boolean;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  title,
  description,
  category,
  files,
  onUpload,
  onDelete,
  onReplace,
  maxFiles = category === 'project' ? 10 : 1,
  isUploading = false
}) => {
  const [showUpload, setShowUpload] = useState(files.length === 0);

  const accept = {
    profile: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    resume: { 'application/pdf': ['.pdf'] },
    project: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }
  };

  const handleFileSelect = async (selectedFiles: File[]) => {
    try {
      await onUpload(selectedFiles);
      if (category !== 'project' || files.length + selectedFiles.length >= maxFiles) {
        setShowUpload(false);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleReplace = async (fileId: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = Object.keys(accept[category]).join(',');
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          await onReplace(file, fileId);
        } catch (error) {
          console.error('Replace failed:', error);
        }
      }
    };
    
    input.click();
  };

  const canAddMore = category === 'project' ? files.length < maxFiles : files.length === 0;

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {category === 'project' && files.length > 0 && canAddMore && (
            <Button
              size="sm"
              onClick={() => setShowUpload(true)}
              disabled={isUploading}
              className="shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add More
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Upload Zone */}
        {(showUpload && canAddMore) && (
          <div className="space-y-3">
            <DropZone
              onFileSelect={handleFileSelect}
              accept={accept[category]}
              maxFiles={category === 'project' ? maxFiles - files.length : 1}
              category={category}
              disabled={isUploading}
            />
            
            {files.length > 0 && category === 'project' && (
              <Button
                variant="outline"
                onClick={() => setShowUpload(false)}
                className="w-full"
              >
                Cancel
              </Button>
            )}
          </div>
        )}

        {/* File Previews */}
        {files.length > 0 && (
          <div className={cn(
            "space-y-4",
            category === 'project' && "grid grid-cols-1 md:grid-cols-2 gap-4"
          )}>
            {files.map((file) => (
              <FilePreview
                key={file.id}
                file={file}
                onDelete={() => onDelete(file.id)}
                onReplace={() => handleReplace(file.id)}
                className={category === 'project' ? "" : "max-w-md"}
              />
            ))}
          </div>
        )}

        {/* Add First File Button for single file categories */}
        {files.length === 0 && !showUpload && category !== 'project' && (
          <Button
            onClick={() => setShowUpload(true)}
            variant="outline"
            className="w-full h-32 border-dashed"
            disabled={isUploading}
          >
            <div className="flex flex-col items-center space-y-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span>Upload {category === 'profile' ? 'Profile Picture' : 'Resume'}</span>
            </div>
          </Button>
        )}

        {/* Loading State */}
        {isUploading && (
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};