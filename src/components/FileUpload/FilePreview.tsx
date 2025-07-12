import React, { useState } from 'react';
import { FileData } from '@/hooks/useFileManager';
import { X, Download, RotateCcw, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file: FileData;
  onDelete: () => void;
  onReplace: () => void;
  className?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  file,
  onDelete,
  onReplace,
  className
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isImage = file.type.startsWith('image/');
  const isPDF = file.type === 'application/pdf';

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadFile = () => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = () => {
    if (isPDF) {
      setIsDialogOpen(true);
    } else {
      setIsDialogOpen(true);
    }
  };

  const openInNewTab = () => {
    window.open(file.url, '_blank');
  };

  return (
    <>
      <Card className={cn("p-4 hover:shadow-elegant transition-all duration-300", className)}>
        <div className="space-y-4">
          {/* File Preview */}
          <div className="relative group cursor-pointer" onClick={openPreview}>
            {isImage ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            ) : isPDF ? (
              <div className="aspect-video rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 flex items-center justify-center transition-all duration-300 group-hover:shadow-lg">
                <div className="text-center">
                  <div className="text-5xl mb-3 transition-transform duration-300 group-hover:scale-110">📄</div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                    PDF Document
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400 opacity-70">
                    Click to preview
                  </p>
                </div>
              </div>
            ) : (
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <p className="text-sm font-medium text-muted-foreground">
                    File Preview
                  </p>
                </div>
              </div>
            )}

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center space-x-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openPreview();
                }}
                className="bg-background/90 hover:bg-background"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  openInNewTab();
                }}
                className="bg-background/90 hover:bg-background"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadFile();
                }}
                className="bg-background/90 hover:bg-background"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* File Info */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              <Badge variant="secondary" className="ml-2 capitalize">
                {file.category}
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={onReplace}
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Replace
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={onDelete}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isPDF ? "📄" : "🖼️"} {file.name}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {isPDF ? (
              <iframe
                src={file.url}
                className="w-full h-[70vh] border rounded-lg"
                title={`Preview of ${file.name}`}
              />
            ) : isImage ? (
              <div className="flex items-center justify-center max-h-[70vh] overflow-hidden">
                <img
                  src={file.url}
                  alt={file.name}
                  className="max-w-full max-h-full object-contain rounded-lg"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-[70vh] bg-muted rounded-lg">
                <div className="text-center">
                  <div className="text-6xl mb-4">📁</div>
                  <p className="text-lg font-medium">File Preview</p>
                  <p className="text-muted-foreground">Preview not available for this file type</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};