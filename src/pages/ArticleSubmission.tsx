import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { submitArticle, getArticles, updateArticle, updateArticleTags, deleteArticle } from '@/lib/articleApi';
import type { ArticleWithRelations } from '@/lib/supabase';
import { PlusCircle, Settings, Trash2, Edit2, Save, X, FileText, Calendar, User, Tag } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Tool = 'publish' | 'manage';

// Complete interface with all fields
interface ArticleFormData {
  title: string;
  author: string;
  content: string;
  category: string;
  tags: string;
  publishedAt: string; // ISO format YYYY-MM-DD
  excerpt: string; // Article summary/description
}

interface EditingArticle {
  id: number;
  title: string;
  author: string;
  content: string;
  excerpt: string;
  published_at: string;
  tags: string;
}

// Helper: Format ISO to European DD/MM/YYYY for display
const toEuropeanDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
};

// Helper: Format timestamp to European for article list
const formatDateDisplay = (isoTimestamp: string): string => {
  if (!isoTimestamp) return '';
  return new Date(isoTimestamp).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function ArticleSubmission() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTool, setActiveTool] = useState<Tool>(() => {
  const saved = localStorage.getItem('lumina_editor_tool');
  return (saved as Tool) || 'publish';
});
  const handleToolChange = (tool: Tool) => {
  setActiveTool(tool);
  localStorage.setItem('lumina_editor_tool', tool);
};

// Update the tool switcher to save to localStorage:
const handleToolChange = (tool: Tool) => {
  setActiveTool(tool);
  localStorage.setItem('lumina_editor_tool', tool);
};
  
  // Publish form state - includes excerpt from the start
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    author: '',
    content: '',
    category: 'Lumina',
    tags: '',
    publishedAt: new Date().toISOString().slice(0, 10),
    excerpt: '', // Initialized empty
  });

  // Manage state
  const [articles, setArticles] = useState<ArticleWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditingArticle | null>(null);

  useEffect(() => {
    if (activeTool === 'manage') {
      loadArticles();
    }
  }, [activeTool]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const data = await getArticles();
      setArticles(data);
    } catch (error) {
      toast({ title: "Errore", description: "Impossibile caricare gli articoli", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // Publish handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert ISO date + midnight time for database
    const fullTimestamp = formData.publishedAt + 'T00:00:00';

    // Include excerpt in submission
    const result = await submitArticle({
      title: formData.title,
      author: formData.author,
      content: formData.content,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      publishedAt: fullTimestamp,
      excerpt: formData.excerpt, // Included in API call
    });

    if (result.success) {
      toast({title: "Articolo Pubblicato", description: `"${formData.title}" è stato pubblicato con successo!`});
      // Reset including excerpt
      setFormData({
        title: '',
        author: '',
        content: '',
        category: 'Lumina',
        tags: '',
        publishedAt: new Date().toISOString().slice(0, 10),
        excerpt: '', // Reset to empty
      });
    } else {
      toast({ title: "Errore", description: result.error, variant: "destructive" });
    }
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manage handlers
  const startEditing = (article: ArticleWithRelations) => {
    setEditingId(article.id);
    const dateOnly = article.published_at ? article.published_at.slice(0, 10) : '';
    
    setEditForm({
      id: article.id,
      title: article.title,
      author: article.author.name,
      content: article.content,
      excerpt: article.excerpt || '', // Include excerpt
      published_at: dateOnly,
      tags: article.tags.map(t => t.name).join(', '),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveEdit = async () => {
    if (!editForm) return;
    
    const fullTimestamp = editForm.published_at + 'T00:00:00';
    
    const result = await updateArticle(editForm.id, {
      title: editForm.title,
      content: editForm.content,
      excerpt: editForm.excerpt, // Include in update
      published_at: fullTimestamp,
      author: editForm.author,
    });

    if (result.success) {
      const tagList = editForm.tags.split(',').map(t => t.trim()).filter(Boolean);
      await updateArticleTags(editForm.id, tagList);
      
      toast({ title: "Modifiche Salvate" });
      setEditingId(null);
      setEditForm(null);
      loadArticles();
    } else {
      toast({ title: "Errore", description: result.error, variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Sei sicuro di voler eliminare questo articolo?')) return;
    
    const result = await deleteArticle(id);
    if (result.success) {
      toast({ title: "Articolo Eliminato" });
      loadArticles();
    } else {
      toast({ title: "Errore", description: "Impossibile eliminare", variant: "destructive" });
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* SIDEBAR */}
      <aside style={{ 
        width: '280px', 
        minWidth: '280px',
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #e2e8f0',
        minHeight: '100vh',
        padding: '24px',
        display: 'block',
        flexShrink: 0,
        boxSizing: 'border-box'
      }}>
        <h2 style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          marginBottom: '24px', 
          color: '#1e293b',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Settings className="w-6 h-6" />
          Editor Menu
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            onClick={() => handleToolChange('publish')}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: activeTool === 'publish' ? '#4f46e5' : '#f1f5f9',
              color: activeTool === 'publish' ? 'white' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            <Settings className="w-5 h-5" />
            Pubblicazione Articoli
          </button>
          
          <button
            onClick={() => handleToolChange('manage')}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              border: 'none',
              textAlign: 'left',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: activeTool === 'manage' ? '#4f46e5' : '#f1f5f9',
              color: activeTool === 'manage' ? 'white' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            <Settings className="w-5 h-5" />
            Gestione Articoli
          </button>
        </nav>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
          <button 
            onClick={() => navigate('/')}
            style={{ 
              color: '#64748b', 
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 0'
            }}
          >
            ← Torna al sito
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', minWidth: 0 }}>
        
        {/* PUBLISH TOOL */}
        {activeTool === 'publish' && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-2 text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Pubblica Articolo
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Crea e pubblica un nuovo articolo su LUMINA
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold text-slate-700">
                      Titolo *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      type="text"
                      required
                      placeholder="Titolo dell'articolo..."
                      value={formData.title}
                      onChange={handleChange}
                      className="h-12 text-lg border-slate-200 focus:border-indigo-500"
                    />
                  </div>

                  {/* Author */}
                  <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-semibold text-slate-700">
                      Autore *
                    </Label>
                    <Input
                      id="author"
                      name="author"
                      type="text"
                      required
                      placeholder="Nome autore"
                      value={formData.author}
                      onChange={handleChange}
                      className="h-12 border-slate-200 focus:border-indigo-500"
                    />
                  </div>

                  {/* Date with react-datepicker */}
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-slate-700">
                      Data Pubblicazione *
                    </Label>
                    <div className="flex items-center gap-3">
                      <DatePicker
                        selected={formData.publishedAt ? new Date(formData.publishedAt) : new Date()}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const isoDate = date.toISOString().slice(0, 10);
                            setFormData(prev => ({ ...prev, publishedAt: isoDate }));
                          }
                        }}
                        dateFormat="dd/MM/yyyy"
                        locale="it"
                        minDate={new Date('2000-01-01')}
                        maxDate={new Date('2050-12-31')}
                        className="h-12 px-4 border border-slate-200 rounded-md focus:border-indigo-500 focus:ring-indigo-500 w-48"
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        required
                      />
                      <span className="text-sm text-slate-500">Formato: gg/mm/aaaa</span>
                    </div>
                  </div>

                  {/* EXCERPT/SUMMARY FIELD - ADDED HERE */}
                  <div className="space-y-2">
                    <Label htmlFor="excerpt" className="text-sm font-semibold text-slate-700">
                      Sommario/Descrizione
                    </Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      rows={3}
                      placeholder="Breve descrizione dell'articolo (opzionale)..."
                      value={formData.excerpt}
                      onChange={handleChange}
                      className="border-slate-200 focus:border-indigo-500 resize-none text-sm"
                      maxLength={200}
                    />
                    <p className="text-xs text-slate-500">
                      {formData.excerpt?.length || 0}/200 caratteri. Vuoto = auto-generato dai primi 200 caratteri.
                    </p>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <Label htmlFor="content" className="text-sm font-semibold text-slate-700">
                      Contenuto *
                    </Label>
                    <Textarea
                      id="content"
                      name="content"
                      required
                      rows={12}
                      placeholder="Scrivi il contenuto..."
                      value={formData.content}
                      onChange={handleChange}
                      className="min-h-[300px] border-slate-200 focus:border-indigo-500 resize-y font-mono text-sm leading-relaxed"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-2">
                    <Label htmlFor="tags" className="text-sm font-semibold text-slate-700">
                      Tag (separati da virgola)
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      type="text"
                      placeholder="ricerca, studenti, opinione..."
                      value={formData.tags}
                      onChange={handleChange}
                      className="h-12 border-slate-200 focus:border-indigo-500"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg"
                  >
                    {isSubmitting ? 'Pubblicazione...' : 'Pubblica Articolo'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* MANAGE TOOL */}
        {activeTool === 'manage' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Gestione Articoli</h2>
              <Button onClick={loadArticles} variant="outline" size="sm">
                Aggiorna Lista
              </Button>
            </div>

            {loading ? (
              <p className="text-center py-8">Caricamento...</p>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden">
                    {editingId === article.id && editForm ? (
                      // EDIT MODE
                      <CardContent className="p-6 space-y-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Edit2 className="w-5 h-5 text-indigo-600" />
                            Modifica Articolo #{article.id}
                          </h3>
                          <div className="flex gap-2">
                            <Button onClick={saveEdit} size="sm" className="bg-green-600 hover:bg-green-700">
                              <Save className="w-4 h-4 mr-1" /> Salva
                            </Button>
                            <Button onClick={cancelEditing} size="sm" variant="outline">
                              <X className="w-4 h-4 mr-1" /> Annulla
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-semibold flex items-center gap-1 mb-1">
                              <FileText className="w-3 h-3" /> Titolo
                            </Label>
                            <Input
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="h-9"
                            />
                          </div>
                          <div>
                            <Label className="text-xs font-semibold flex items-center gap-1 mb-1">
                              <User className="w-3 h-3" /> Autore
                            </Label>
                            <Input
                              value={editForm.author}
                              onChange={(e) => setEditForm({...editForm, author: e.target.value})}
                              className="h-9"
                            />
                          </div>
                        </div>

                        {/* Edit date */}
                        <div>
                          <Label className="text-xs font-semibold flex items-center gap-1 mb-1">
                            <Calendar className="w-3 h-3" /> Data
                          </Label>
                          <DatePicker
                            selected={editForm.published_at ? new Date(editForm.published_at) : new Date()}
                            onChange={(date: Date | null) => {
                              if (date) {
                                const isoDate = date.toISOString().slice(0, 10);
                                setEditForm({...editForm, published_at: isoDate});
                              }
                            }}
                            dateFormat="dd/MM/yyyy"
                            locale="it"
                            minDate={new Date('2000-01-01')}
                            maxDate={new Date('2050-12-31')}
                            className="h-9 px-3 border border-slate-200 rounded-md focus:border-indigo-500 w-44"
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                          />
                        </div>

                        {/* Edit excerpt */}
                        <div>
                          <Label className="text-xs font-semibold mb-1">Sommario/Descrizione</Label>
                          <Textarea
                            value={editForm.excerpt}
                            onChange={(e) => setEditForm({...editForm, excerpt: e.target.value})}
                            rows={2}
                            className="text-sm"
                            maxLength={200}
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            {editForm.excerpt?.length || 0}/200 caratteri
                          </p>
                        </div>

                        {/* Edit content */}
                        <div>
                          <Label className="text-xs font-semibold mb-1">Contenuto</Label>
                          <Textarea
                            value={editForm.content}
                            onChange={(e) => setEditForm({...editForm, content: e.target.value})}
                            rows={6}
                            className="text-sm font-mono"
                          />
                        </div>

                        {/* Edit tags */}
                        <div>
                          <Label className="text-xs font-semibold flex items-center gap-1 mb-1">
                            <Tag className="w-3 h-3" /> Tag (separati da virgola)
                          </Label>
                          <Input
                            value={editForm.tags}
                            onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                            className="h-9"
                          />
                        </div>
                      </CardContent>
                    ) : (
                      // VIEW MODE
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-lg">{article.title}</h3>
                              <Badge variant="secondary">ID: {article.id}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-3">
                              <span>Autore: {article.author.name}</span>
                              <span>Data: {formatDateDisplay(article.published_at)}</span>
                              <span>Slug: {article.slug}</span>
                            </div>
                            {/* Show excerpt if exists */}
                            {article.excerpt && (
                              <p className="text-sm text-slate-600 italic mb-2">
                                {article.excerpt}
                              </p>
                            )}
                            <p className="text-sm text-slate-600 line-clamp-2">
                              {article.content.substring(0, 150)}...
                            </p>
                            {article.tags.length > 0 && (
                              <div className="flex gap-1 mt-3">
                                {article.tags.map(tag => (
                                  <Badge key={tag.id} variant="outline" className="text-xs">{tag.name}</Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button 
                              onClick={() => startEditing(article)} 
                              size="sm" 
                              variant="outline"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              onClick={() => handleDelete(article.id)} 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
                
                {articles.length === 0 && (
                  <p className="text-center text-slate-500 py-8">Nessun articolo trovato nel database.</p>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
