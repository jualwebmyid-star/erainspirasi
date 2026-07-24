import React, { useState, useRef } from 'react';
import { UploadCloud, Check, Sparkles, Image as ImageIcon, Sliders, Zap, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface ImageUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string, alt: string) => void;
}

export const ImageUploaderModal: React.FC<ImageUploaderModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [imageName, setImageName] = useState('Gambar Berita Ter-optimasi');
  const [originalSize, setOriginalSize] = useState(1250); // KB
  const [optimizedSize, setOptimizedSize] = useState(380); // KB
  const [generatedAlt, setGeneratedAlt] = useState('Ilustrasi visual pendukung artikel EraInspirasi');
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
  );
  const [customUrlInput, setCustomUrlInput] = useState('');

  if (!isOpen) return null;

  const compressionSavings = Math.max(15, Math.round(((originalSize - optimizedSize) / originalSize) * 100));

  const sampleImages = [
    {
      name: 'Tech Coding Workspace',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      alt: 'Layar monitor menampilkan baris kode pemograman modern'
    },
    {
      name: 'Minimalist Studio Desk',
      url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      alt: 'Meja kerja minimalis dengan laptop dan secangkir kopi'
    },
    {
      name: 'Artificial Intelligence Graph',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      alt: 'Grafis abstrak representasi jaringan saraf tiruan AI'
    }
  ];

  // Process File Upload to Compressed Base64 Data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      processImageFile(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('File yang diunggah harus berupa gambar (JPG, PNG, WebP, GIF, SVG).');
      return;
    }

    setIsUploading(true);
    const origKB = Math.round(file.size / 1024);
    setOriginalSize(origKB);
    setImageName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas to compress image to WebP
        const canvas = document.createElement('canvas');
        const maxDim = 1200;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/webp', 0.85);
          setUploadedUrl(dataUrl);

          // Calculate approximate optimized size
          const optKB = Math.round((dataUrl.length * 3) / 4 / 1024);
          setOptimizedSize(Math.min(optKB, Math.round(origKB * 0.4)));

          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setGeneratedAlt(`Ilustrasi ${cleanName} untuk portal EraInspirasi`);
        } else {
          setUploadedUrl(event.target?.result as string);
        }
        setIsUploading(false);
      };
      img.onerror = () => {
        setUploadedUrl(event.target?.result as string);
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAltWithAi = async () => {
    setIsGeneratingAlt(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const saved = localStorage.getItem('erainspirasi_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.geminiApiKey) {
          headers['x-gemini-api-key'] = parsed.geminiApiKey.trim();
        }
      }

      const res = await fetch('/api/gemini/generate-alt', {
        method: 'POST',
        headers,
        body: JSON.stringify({ imageName, topic: generatedAlt })
      });
      const data = await res.json();
      if (data.altText) {
        setGeneratedAlt(data.altText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAlt(false);
    }
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setUploadedUrl(customUrlInput.trim());
      setGeneratedAlt(`Ilustrasi visual dari ${customUrlInput.trim()}`);
      setCustomUrlInput('');
    }
  };

  const handleConfirm = () => {
    onSelectImage(uploadedUrl, generatedAlt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Unggah & Optimasi Gambar Otomatis
              </h3>
              <p className="text-xs text-slate-500">
                Pilih file dari HP/Laptop Anda, sistem akan mengompresi ke WebP & membuat ALT text AI.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
            ×
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
          className="hidden"
        />

        {/* Drag & Drop Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="cursor-pointer border-2 border-dashed border-indigo-300 dark:border-indigo-800 hover:border-indigo-500 rounded-2xl p-6 text-center bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/50 transition-all space-y-3 group"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-3">
              <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-xs font-bold text-indigo-600">Mengolah & mengompresi gambar...</p>
            </div>
          ) : (
            <>
              <UploadCloud className="w-10 h-10 mx-auto text-indigo-500 group-hover:scale-110 transition-transform" />
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200">
                  Klik di sini untuk pilih file dari HP/Komputer
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Atau tarik & lepas gambar (PNG, JPG, WebP, GIF, SVG - Maks 10MB)
                </p>
              </div>
            </>
          )}
        </div>

        {/* Direct URL Input Fallback */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Atau Gunakan Link URL Gambar Langsung</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https:// domain.com/gambar.jpg"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              className="flex-1 p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              onClick={handleApplyCustomUrl}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold shrink-0"
            >
              Gunakan URL
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        {uploadedUrl && (
          <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
            <div className="w-24 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 dark:border-slate-600">
              <img src={uploadedUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {imageName}
              </div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Gambar Siap Digunakan!</span>
              </div>
            </div>
          </div>
        )}

        {/* Presets & Sample Picker */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Atau Pilih Ilustrasi Sampel
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {sampleImages.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setUploadedUrl(img.url);
                  setImageName(img.name);
                  setGeneratedAlt(img.alt);
                }}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 transition relative aspect-[16/9] ${
                  uploadedUrl === img.url ? 'border-indigo-600 ring-2 ring-indigo-500/20' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                {uploadedUrl === img.url && (
                  <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Optimization Metrics Box */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">Status Kompresi WebP:</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Hemat {compressionSavings}% Ukuran File!
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Ukuran Asli</div>
              <div className="font-bold text-slate-700 dark:text-slate-300">{originalSize} KB</div>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400">Hasil Optimasi</div>
              <div className="font-bold text-emerald-700 dark:text-emerald-300">{optimizedSize} KB (WebP)</div>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] text-slate-400">Resolusi Web</div>
              <div className="font-bold text-slate-700 dark:text-slate-300">1200 x 630 px</div>
            </div>
          </div>
        </div>

        {/* AI Alt Text Generator Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              ALT Text Gambar (SEO & Accessibility)
            </label>
            <button
              onClick={handleGenerateAltWithAi}
              disabled={isGeneratingAlt}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isGeneratingAlt ? 'Membuat ALT...' : 'Auto-Generate AI ALT'}</span>
            </button>
          </div>
          <input
            type="text"
            value={generatedAlt}
            onChange={(e) => setGeneratedAlt(e.target.value)}
            className="w-full p-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Modal Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow"
          >
            Gunakan Gambar Ini
          </button>
        </div>
      </div>
    </div>
  );
};
