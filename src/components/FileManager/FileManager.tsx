import React, { useState } from 'react';
import { useFileManager } from '@/hooks/useFileManager';
import { FileUploadSection } from '@/components/FileUpload/FileUploadSection';
import { PortfolioPreview } from '@/components/Portfolio/PortfolioPreview';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, FolderOpen, Eye, Upload, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const FileManager: React.FC = () => {
  const { files, isUploading, uploadFile, deleteFile, replaceFile } = useFileManager();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upload');

  const handleUpload = async (uploadFiles: File[], category: 'profile' | 'resume' | 'project') => {
    try {
      for (const file of uploadFiles) {
        await uploadFile(file, category);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDelete = (fileId: string, category: 'profile' | 'resume' | 'project') => {
    deleteFile(fileId, category);
  };

  const handleReplace = async (file: File, category: 'profile' | 'resume' | 'project', fileId?: string) => {
    try {
      await replaceFile(file, category, fileId);
    } catch (error) {
      console.error('Replace failed:', error);
    }
  };

  const clearAllFiles = () => {
    localStorage.removeItem('portfolio_files');
    window.location.reload();
  };

  const getTotalFiles = () => {
    let count = 0;
    if (files.profile) count++;
    if (files.resume) count++;
    count += files.projects.length;
    return count;
  };

  const getCompletionPercentage = () => {
    let completed = 0;
    const total = 3; // profile, resume, at least one project
    
    if (files.profile) completed++;
    if (files.resume) completed++;
    if (files.projects.length > 0) completed++;
    
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Portfolio File Manager
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload and manage your portfolio files with real-time preview. 
            Organize your profile picture, resume, and project images all in one place.
          </p>
        </div>

        {/* Statistics */}
        <Card className="mb-8 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Portfolio Overview</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">
                  {getTotalFiles()} files
                </Badge>
                <Badge 
                  variant={getCompletionPercentage() === 100 ? "default" : "secondary"}
                  className={getCompletionPercentage() === 100 ? "bg-success" : ""}
                >
                  {getCompletionPercentage()}% complete
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                <div className="flex items-center justify-center mb-2">
                  <Image className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Profile Picture</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {files.profile ? '✓ Uploaded' : 'Not uploaded'}
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">Resume</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {files.resume ? '✓ Uploaded' : 'Not uploaded'}
                </p>
              </div>
              
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                <div className="flex items-center justify-center mb-2">
                  <FolderOpen className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-green-900 dark:text-green-100">Projects</h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {files.projects.length} image{files.projects.length !== 1 ? 's' : ''} uploaded
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Manage Files</span>
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center space-x-2">
                <Eye className="h-4 w-4" />
                <span>Live Preview</span>
              </TabsTrigger>
            </TabsList>

            {getTotalFiles() > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={clearAllFiles}
                className="flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Clear All</span>
              </Button>
            )}
          </div>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profile Picture Section */}
              <FileUploadSection
                title="Profile Picture"
                description="Upload a professional headshot for your portfolio"
                category="profile"
                files={files.profile ? [files.profile] : []}
                onUpload={(uploadFiles) => handleUpload(uploadFiles, 'profile')}
                onDelete={(fileId) => handleDelete(fileId, 'profile')}
                onReplace={(file) => handleReplace(file, 'profile')}
                maxFiles={1}
                isUploading={isUploading}
              />

              {/* Resume Section */}
              <FileUploadSection
                title="Resume / CV"
                description="Upload your latest resume in PDF format"
                category="resume"
                files={files.resume ? [files.resume] : []}
                onUpload={(uploadFiles) => handleUpload(uploadFiles, 'resume')}
                onDelete={(fileId) => handleDelete(fileId, 'resume')}
                onReplace={(file) => handleReplace(file, 'resume')}
                maxFiles={1}
                isUploading={isUploading}
              />
            </div>

            {/* Project Images Section */}
            <FileUploadSection
              title="Project Images"
              description="Upload images showcasing your projects and work"
              category="project"
              files={files.projects}
              onUpload={(uploadFiles) => handleUpload(uploadFiles, 'project')}
              onDelete={(fileId) => handleDelete(fileId, 'project')}
              onReplace={(file, fileId) => handleReplace(file, 'project', fileId)}
              maxFiles={10}
              isUploading={isUploading}
            />
          </TabsContent>

          <TabsContent value="preview" className="space-y-6">
            <PortfolioPreview data={files} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};