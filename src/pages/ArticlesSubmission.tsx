import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface ArticleFormData {
  title: string;
  author: string;
  content: string;
  category: string;
  tags: string;
}

const API_BASE_URL = 'https://insud.eu';

export default function ArticleSubmission() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    author: '',
    content: '',
    category: 'Lumina',
    tags: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const articleData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        publishedAt: new Date().toISOString(),
        status: 'pending_review',
      };

      const response = await fetch(`${API_BASE_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      toast({
        title: "Article Submitted Successfully",
        description: `Your article has been sent for review (ID: ${data.id}) and will be published in the Lumina section.`,
      });

      setFormData({
        title: '',
        author: '',
        content: '',
        category: 'Lumina',
        tags: '',
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-2 text-center pb-8">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Submit to Lumina
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Share your insights, research, and stories with the INSUD community
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                  Article Title *
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Enter a compelling title..."
                  value={formData.title}
                  onChange={handleChange}
                  className="h-12 text-lg border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author" className="text-sm font-semibold text-slate-700">
                  Author Name *
                </Label>
                <Input
                  id="author"
                  name="author"
                  type="text"
                  required
                  placeholder="Your name or pseudonym"
                  value={formData.author}
                  onChange={handleChange}
                  className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                  Article Content *
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  required
                  rows={12}
                  placeholder="Write your article here... You can use Markdown formatting."
                  value={formData.content}
                  onChange={handleChange}
                  className="min-h-[300px] border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 resize-y font-mono text-sm leading-relaxed"
                />
                <p className="text-xs text-slate-500">
                  Tip: Use Markdown for formatting. Minimum 100 characters recommended.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">
                  Tags (comma separated)
                </Label>
                <Input
                  id="tags"
                  name="tags"
                  type="text"
                  placeholder="research, student-life, opinion, interview..."
                  value={formData.tags}
                  onChange={handleChange}
                  className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Article'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="h-12 px-8 border-slate-300 hover:bg-slate-50"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            This page is only accessible via direct link. Articles are reviewed before publication.
          </p>
        </div>
      </div>
    </div>
  );
}
