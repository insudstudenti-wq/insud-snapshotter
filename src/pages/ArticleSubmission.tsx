import { useState, useEffect } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { submitArticle, getArticles, updateArticle, updateArticleTags, deleteArticle } from '@/lib/articleApi';
import type { ArticleWithRelations, ContentBlock } from '@/lib/supabase';
import {
  toEuropeanDate,
  formatDateDisplay,
  syncBlocksToContent,
  createInitialFormData,
  textBoxStyles,
  stripHtml,
  type Tool,
  type BlockType,
  type ArticleFormData,
  type EditingArticle,
} from '@/lib/articleSubmission';
import { PlusCircle, Settings, Trash2, Edit2, Save, X, FileText, Calendar, User, Tag, Type, Box, GripVertical, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { RichTextEditor, RichTextContent } from '@/components/RichTextEditor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Type for block updates
type BlockUpdate = Partial<ContentBlock>;

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
  
  // Publish form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>(createInitialFormData());

  // Content Builder state
  const [showPreview, setShowPreview] = useState(true);
  const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);

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

  // Content Block Management
  const addBlock = (type: BlockType) => {
    const newBlock = type === 'paragraph' 
      ? { type: 'paragraph' as const, content: '' }
      : { type: 'textbox' as const, title: '', content: '', style: 'default' as const };
    
    setFormData(prev => ({
      ...prev,
      contentBlocks: [...prev.contentBlocks, newBlock]
    }));
    setActiveBlockIndex(formData.contentBlocks.length);
  };

  const updateBlock = (index: number, updates: BlockUpdate) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.map((block, i) => 
        i === index ? { ...block, ...updates } as ContentBlock : block
      )
    }));
  };

  const removeBlock = (index: number) => {
    setFormData(prev => ({
      ...prev,
      contentBlocks: prev.contentBlocks.filter((_, i) => i !== index)
    }));
    if (activeBlockIndex === index) setActiveBlockIndex(null);
    if (activeBlockIndex !== null && activeBlockIndex > index) {
      setActiveBlockIndex(activeBlockIndex - 1);
    }
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.contentBlocks.length) return;
    
    const blocks = [...formData.contentBlocks];
    [blocks[index], blocks[newIndex]] = [blocks[newIndex], blocks[index]];
    setFormData(prev => ({ ...prev, contentBlocks: blocks }));
    setActiveBlockIndex(newIndex);
  };

  // Publish handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert content blocks to plain text for storage
    const plainContent = syncBlocksToContent(formData.contentBlocks) || formData.content;

    // Convert ISO date + midnight time for database
    const fullTimestamp = formData.publishedAt + 'T00:00:00';

    const result = await submitArticle({
      title: formData.title,
      author: formData.author,
      content: plainContent,
      category: formData.category,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      publishedAt: fullTimestamp,
      excerpt: formData.excerpt || undefined,
      contentBlocks: formData.contentBlocks.length > 0 ? formData.contentBlocks : undefined,
    });

    if (result.success) {
      toast({title: "Articolo Pubblicato", description: `"${formData.title}" è stato pubblicato con successo!`});
      // Reset form
      setFormData(createInitialFormData());
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
    
    // Parse content blocks from article if they exist
    const contentBlocks = article.content_blocks || [];
    
    setEditForm({
      id: article.id,
      title: article.title,
      author: article.author.name,
      content: article.content,
      excerpt: article.excerpt || '',
      published_at: dateOnly,
      tags: article.tags.map(t => t.name).join(', '),
      contentBlocks: contentBlocks,
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
      excerpt: editForm.excerpt,
      published_at: fullTimestamp,
      author: editForm.author,
      contentBlocks: editForm.contentBlocks.length > 0 ? editForm.contentBlocks : undefined,
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
            <PlusCircle className="w-5 h-5" />
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
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="space-y-2 text-center pb-8">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Pubblica Articolo
                </CardTitle>
                <CardDescription className="text-lg text-slate-600">
                  Crea e pubblica un nuovo articolo su LUMINA con il Content Builder
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

                  {/* Date */}
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

                  {/* Excerpt */}
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

                  {/* Content Builder Toolbar */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <Box className="w-4 h-4" />
                        Content Builder
                      </Label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowPreview(!showPreview)}
                          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-2 py-1 rounded"
                        >
                          {showPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          {showPreview ? 'Nascondi Preview' : 'Mostra Preview'}
                        </button>
                      </div>
                    </div>

                    {/* Toolbar */}
                    <div className="bg-slate-100 p-4 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 mb-3">Aggiungi blocchi di contenuto:</p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addBlock('paragraph')}
                          className="flex items-center gap-1 bg-white"
                        >
                          <Type className="w-4 h-4" />
                          Paragrafo
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addBlock('textbox')}
                          className="flex items-center gap-1 bg-white"
                        >
                          <Box className="w-4 h-4" />
                          Text Box
                        </Button>
                      </div>
                    </div>

                    {/* Content Blocks Editor */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: Block Editor */}
                      <div className="space-y-3">
                        <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          Blocchi ({formData.contentBlocks.length})
                        </Label>
                        
                        {formData.contentBlocks.length === 0 && (
                          <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-sm text-slate-500">
                              Nessun blocco ancora. Usa la toolbar sopra per aggiungere contenuto.
                            </p>
                          </div>
                        )}

                        {formData.contentBlocks.map((block, index) => (
                          <div
                            key={index}
                            className={`border rounded-lg overflow-hidden transition-all ${
                              activeBlockIndex === index 
                                ? 'border-indigo-500 ring-1 ring-indigo-500' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                            onClick={() => setActiveBlockIndex(index)}
                          >
                            {/* Block Header */}
                            <div className="bg-slate-50 px-3 py-2 flex items-center justify-between border-b border-slate-200">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-slate-400" />
                                <span className="text-xs font-medium text-slate-600">
                                  {block.type === 'paragraph' ? 'Paragrafo' : 'Text Box'}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); moveBlock(index, 'up'); }}
                                  disabled={index === 0}
                                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowUp className="w-3 h-3 text-slate-600" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); moveBlock(index, 'down'); }}
                                  disabled={index === formData.contentBlocks.length - 1}
                                  className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowDown className="w-3 h-3 text-slate-600" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeBlock(index); }}
                                  className="p-1 rounded hover:bg-red-100 text-red-500"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* Block Content */}
                            <div className="p-3 space-y-3">
                              {block.type === 'textbox' && (
                                <>
                                  <div>
                                    <Label className="text-xs text-slate-500">Stile</Label>
                                    <select
                                      value={block.style || 'default'}
                                      onChange={(e) => updateBlock(index, { style: e.target.value as any })}
                                      className="mt-1 w-full text-sm border border-slate-200 rounded px-2 py-1"
                                    >
                                      <option value="default">Default</option>
                                      <option value="info">Info (Blu)</option>
                                      <option value="warning">Warning (Arancione)</option>
                                      <option value="success">Success (Verde)</option>
                                    </select>
                                  </div>
                                  <div>
                                    <Label className="text-xs text-slate-500">Titolo</Label>
                                    <Input
                                      value={block.title}
                                      onChange={(e) => updateBlock(index, { title: e.target.value })}
                                      placeholder="Titolo del box..."
                                      className="mt-1 h-9 text-sm"
                                    />
                                  </div>
                                </>
                              )}
                              <div>
                                <Label className="text-xs text-slate-500 mb-2 block">Contenuto</Label>
                                <RichTextEditor
                                  value={block.content || ''}
                                  onChange={(html) => updateBlock(index, { content: html })}
                                  placeholder={block.type === 'paragraph' ? "Scrivi il paragrafo..." : "Contenuto del box..."}
                                  rows={block.type === 'textbox' ? 4 : 6}
                                  className="mt-1"
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                  Usa la toolbar per grassetto, corsivo e link. Oppure digita <code className="bg-slate-200 px-1 rounded text-[10px]">[testo](URL)</code> per i link. Puoi anche incollare testo formattato.
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Preview */}
                      {showPreview && (
                        <div className="space-y-3">
                          <Label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            Preview
                          </Label>
                          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm min-h-[400px]">
                            {formData.contentBlocks.length === 0 ? (
                              <p className="text-slate-400 text-center py-8">Nessun contenuto da visualizzare</p>
                            ) : (
                              <div className="space-y-4">
                                {formData.contentBlocks.map((block, index) => {
                                  if (block.type === 'paragraph') {
                                    return (
                                      <div key={index} className="text-foreground/90 leading-relaxed text-[1.05rem]">
                                        {block.content ? (
                                          <RichTextContent html={block.content} />
                                        ) : (
                                          <span className="text-slate-300 italic">Paragrafo vuoto...</span>
                                        )}
                                      </div>
                                    );
                                  }
                                  if (block.type === 'textbox') {
                                    const style = textBoxStyles[block.style || 'default'];
                                    return (
                                      <div key={index} className={`mt-6 p-5 ${style.bg} border ${style.border} rounded-xl`}>
                                        {block.title && (
                                          <h3 className="text-lg font-semibold text-foreground mb-3">
                                            {block.title}
                                          </h3>
                                        )}
                                        <div className="text-foreground/80 text-sm leading-relaxed">
                                          {block.content ? (
                                            <RichTextContent html={block.content} />
                                          ) : (
                                            <span className="text-slate-400 italic">Contenuto vuoto...</span>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  }
                                  return null;
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
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
                          <RichTextEditor
                            value={editForm.content}
                            onChange={(html) => setEditForm({...editForm, content: html})}
                            rows={8}
                            className="mt-1"
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
                              {stripHtml(article.content).substring(0, 150)}...
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
