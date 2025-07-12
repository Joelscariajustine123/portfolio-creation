import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  category: 'profile' | 'resume' | 'project';
  uploadedAt: Date;
}

export interface PortfolioData {
  profile?: FileData;
  resume?: FileData;
  projects: FileData[];
}

const STORAGE_KEY = 'portfolio_files';

export const useFileManager = () => {
  const { toast } = useToast();
  
  const [files, setFiles] = useState<PortfolioData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { projects: [] };
  });

  const [isUploading, setIsUploading] = useState(false);

  const saveToStorage = useCallback((data: PortfolioData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setFiles(data);
  }, []);

  const validateFile = useCallback((file: File, category: string) => {
    const allowedTypes = {
      profile: ['image/jpeg', 'image/png', 'image/webp'],
      resume: ['application/pdf'],
      project: ['image/jpeg', 'image/png', 'image/webp']
    };

    const maxSizes = {
      profile: 5 * 1024 * 1024, // 5MB
      resume: 10 * 1024 * 1024, // 10MB
      project: 5 * 1024 * 1024 // 5MB
    };

    if (!allowedTypes[category as keyof typeof allowedTypes].includes(file.type)) {
      throw new Error(`Invalid file type for ${category}. Please upload ${
        category === 'resume' ? 'PDF' : 'JPG, PNG, or WebP'
      } files only.`);
    }

    if (file.size > maxSizes[category as keyof typeof maxSizes]) {
      throw new Error(`File too large. Maximum size for ${category} is ${
        maxSizes[category as keyof typeof maxSizes] / (1024 * 1024)
      }MB.`);
    }

    return true;
  }, []);

  const uploadFile = useCallback(async (
    file: File, 
    category: 'profile' | 'resume' | 'project'
  ): Promise<FileData> => {
    setIsUploading(true);
    
    try {
      validateFile(file, category);

      // Convert file to base64 for storage
      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const fileData: FileData = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size,
        url,
        category,
        uploadedAt: new Date()
      };

      const updatedFiles = { ...files };
      
      if (category === 'profile') {
        updatedFiles.profile = fileData;
      } else if (category === 'resume') {
        updatedFiles.resume = fileData;
      } else {
        updatedFiles.projects = [...updatedFiles.projects, fileData];
      }

      saveToStorage(updatedFiles);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been uploaded.`,
      });

      return fileData;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [files, validateFile, saveToStorage, toast]);

  const deleteFile = useCallback((fileId: string, category: 'profile' | 'resume' | 'project') => {
    const updatedFiles = { ...files };
    
    if (category === 'profile') {
      delete updatedFiles.profile;
    } else if (category === 'resume') {
      delete updatedFiles.resume;
    } else {
      updatedFiles.projects = updatedFiles.projects.filter(f => f.id !== fileId);
    }

    saveToStorage(updatedFiles);
    
    toast({
      title: "File deleted",
      description: "File has been removed from your portfolio.",
    });
  }, [files, saveToStorage, toast]);

  const replaceFile = useCallback(async (
    file: File,
    category: 'profile' | 'resume' | 'project',
    fileId?: string
  ) => {
    if (category !== 'project' || !fileId) {
      return uploadFile(file, category);
    }

    // For project files, replace the specific file
    setIsUploading(true);
    
    try {
      validateFile(file, category);

      const url = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const updatedFiles = { ...files };
      const projectIndex = updatedFiles.projects.findIndex(f => f.id === fileId);
      
      if (projectIndex !== -1) {
        updatedFiles.projects[projectIndex] = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          url,
          category,
          uploadedAt: new Date()
        };
        
        saveToStorage(updatedFiles);
        
        toast({
          title: "File replaced successfully",
          description: `${file.name} has been updated.`,
        });
      }
    } catch (error) {
      toast({
        title: "Replace failed",
        description: error instanceof Error ? error.message : "Failed to replace file",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [files, validateFile, saveToStorage, toast, uploadFile]);

  return {
    files,
    isUploading,
    uploadFile,
    deleteFile,
    replaceFile
  };
};