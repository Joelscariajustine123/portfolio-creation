import React from 'react';
import { PortfolioData } from '@/hooks/useFileManager';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortfolioPreviewProps {
  data: PortfolioData;
  className?: string;
}

export const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({
  data,
  className
}) => {
  const downloadResume = () => {
    if (data.resume) {
      const link = document.createElement('a');
      link.href = data.resume.url;
      link.download = data.resume.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const viewResume = () => {
    if (data.resume) {
      window.open(data.resume.url, '_blank');
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Hero Section */}
      <Card className="overflow-hidden bg-gradient-primary text-primary-foreground">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Profile Picture */}
            <div className="shrink-0">
              {data.profile ? (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-glow">
                  <img
                    src={data.profile.url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-white/20 flex items-center justify-center">
                  <div className="text-4xl">👤</div>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">John Doe</h1>
              <p className="text-xl text-primary-foreground/80 mb-4">
                Full Stack Developer
              </p>
              <p className="text-primary-foreground/70 max-w-md">
                Passionate developer with expertise in React, Node.js, and modern web technologies. 
                Creating innovative solutions and beautiful user experiences.
              </p>
              
              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm">
                <div className="flex items-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>john@example.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Resume Actions */}
            {data.resume && (
              <div className="shrink-0 space-y-2">
                <Button
                  onClick={viewResume}
                  variant="secondary"
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Resume
                </Button>
                <Button
                  onClick={downloadResume}
                  variant="outline"
                  className="w-full border-white/20 text-primary-foreground hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      {data.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Featured Projects</span>
              <Badge variant="secondary">{data.projects.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.projects.map((project, index) => (
                <div
                  key={project.id}
                  className="group cursor-pointer"
                  onClick={() => window.open(project.url, '_blank')}
                >
                  <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                    <img
                      src={project.url}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      Project {index + 1}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.name.split('.').slice(0, -1).join('.')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle>Skills & Technologies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'React', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker',
              'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Next.js'
            ].map((skill) => (
              <Badge key={skill} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors">
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold">Portfolio Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {data.profile ? '✓' : '○'}
                </div>
                <p className="text-sm text-muted-foreground">Profile Picture</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {data.resume ? '✓' : '○'}
                </div>
                <p className="text-sm text-muted-foreground">Resume</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {data.projects.length}
                </div>
                <p className="text-sm text-muted-foreground">
                  Project{data.projects.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};