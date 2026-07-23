import React, { useState } from 'react';
import { UploadCloud, Check, Sparkles, Image as ImageIcon, Sliders, Zap } from 'lucide-react';

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
  const [selectedPreset, setSelectedPreset] = useState<'banner' | 'body' | 'square'>('banner');
  const [imageName, setImageName] = useState('tech-blog-cover.jpg');
  const [originalSize, setOriginalSize] = useState(1850); // KB
  const [optimizedSize, setOptimizedSize] = useState(580); // KB
  const [generatedAlt, setGeneratedAlt] = useState('Ilustrasi arsitektur sistem web modern Next.js');
  const [isGeneratingAlt, setIsGeneratingAlt] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
  );

  if (!isOpen) return null;

  const compressionSavings = Math.round(((originalSize - optimizedSize) / originalSize) * 100);

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

  const handleGenerateAltWithAi = async () => {
    setIsGeneratingAlt(true);
    try {
      const res = await fetch('/api/gemini/generate-alt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const handleConfirm = () => {
    onSelectImage(uploadedUrl, generatedAlt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        
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
                Kompresi WebP otomatis, pembersihan metadata EXIF, & pembuatan ALT text AI.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
            ×
          </button>
        </div>

        {/* Drag & Drop Simulation */}
        <div className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 rounded-2xl p-6 text-center bg-indigo-50/40 dark:bg-indigo-950/20 space-y-3">
          <UploadCloud className="w-10 h-10 mx-auto text-indigo-500 animate-bounce" />
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Tarik & Lepas gambar Anda di sini, atau klik untuk memilih file
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Mendukung PNG, JPG, WebP (Maksimal 10MB per gambar)
            </p>
          </div>
        </div>

        {/* Presets & Sample Picker */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Atau Pilih Sampel Ilustrasi Ter-optimasi
          </label>
          <div className="grid grid-cols-3 gap-3">
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
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
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
              <div className="text-[10px] text-slate-400">Dimensi Presets</div>
              <div className="font-bold text-slate-700 dark:text-slate-300">1200 x 630 px</div>
            </div>
          </div>
        </div>

        {/* AI Alt Text Generator Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              ALT Text Gambar (Penting untuk SEO & Reader Accessibility)
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
            Gunakan Gambar Ter-optimasi Ini
          </button>
        </div>
      </div>
    </div>
  );
};
