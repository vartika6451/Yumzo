'use client';
import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, Share2, RotateCcw } from 'lucide-react';

export default function FeastCanvas({ feast, onResetFeast }) {
  const canvasRef = useRef(null);
  const [downloadReady, setDownloadReady] = useState(false);

  const { title = 'My Dream Feast', theme = 'Midnight Munchies', items = [], total_price = 0 } = feast || {};

  // Render on HTML5 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 800;
    const height = 600;
    canvas.width = width;
    canvas.height = height;

    // 1. Background
    ctx.fillStyle = '#FFF7EA';
    ctx.fillRect(0, 0, width, height);

    // Decorative Border
    ctx.strokeStyle = '#F4E3CD';
    ctx.lineWidth = 12;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    ctx.strokeStyle = '#F65C45';
    ctx.lineWidth = 2;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // 2. Header
    ctx.fillStyle = '#2F1D1D';
    ctx.font = '900 28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🥟 yumzo. · VIRTUAL FEAST CERTIFICATE', width / 2, 70);

    // Subheader
    ctx.fillStyle = '#F65C45';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('100% IMAGINARY · 0 CALORIES · ZERO PAYMENT', width / 2, 95);

    // Feast Title
    ctx.fillStyle = '#2F1D1D';
    ctx.font = '900 24px sans-serif';
    ctx.fillText(`"${title}"`, width / 2, 140);

    // Theme Pill
    ctx.fillStyle = '#FFC857';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 100, 160, 200, 30, 15);
    ctx.fill();

    ctx.fillStyle = '#2F1D1D';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Theme: ${theme.toUpperCase()}`, width / 2, 180);

    // 3. Draw items in a nice banquet arrangement
    const displayItems = items.slice(0, 6);
    const cols = Math.min(displayItems.length, 3) || 1;
    const rows = Math.ceil(displayItems.length / cols) || 1;

    let loadedImages = 0;
    const totalToLoad = displayItems.length;

    if (totalToLoad === 0) {
      setDownloadReady(true);
      return;
    }

    displayItems.forEach((item, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);

      const cellW = (width - 120) / cols;
      const x = 60 + col * cellW + (cellW - 100) / 2;
      const y = 220 + row * 150;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = item.image || '/images/pizza.jpg';

      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + 50, y + 50, 48, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x + 2, y + 2, 96, 96);
        ctx.restore();

        // Circle border
        ctx.strokeStyle = '#F65C45';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + 50, y + 50, 48, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.fillStyle = '#2F1D1D';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        const label = item.name.length > 18 ? item.name.substring(0, 16) + '...' : item.name;
        ctx.fillText(`${label} (x${item.quantity || 1})`, x + 50, y + 120);

        loadedImages++;
        if (loadedImages >= totalToLoad) {
          setDownloadReady(true);
        }
      };

      img.onerror = () => {
        // Fallback plate
        ctx.fillStyle = '#FFE4BA';
        ctx.beginPath();
        ctx.arc(x + 50, y + 50, 48, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#2F1D1D';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.name.substring(0, 14), x + 50, y + 55);

        loadedImages++;
        if (loadedImages >= totalToLoad) {
          setDownloadReady(true);
        }
      };
    });

    // 4. Footer
    ctx.fillStyle = '#7A6464';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Total Imaginary Worth: ₹${Number(total_price).toFixed(0)} · Happiness Delivered to Your Imagination`, width / 2, 545);
    ctx.font = 'normal 10px sans-serif';
    ctx.fillText(`Generated on ${new Date().toLocaleDateString()} at Yumzo. All dreams reserved.`, width / 2, 565);

  }, [feast, title, theme, items, total_price]);

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `yumzo-feast-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('🔗 Feast link copied! Share your imaginary order with friends.');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Canvas View Container */}
      <div className="w-full max-w-2xl bg-white p-3 rounded-3xl shadow-xl border-4 border-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto rounded-2xl block shadow-inner bg-[#FFF7EA]"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleDownloadImage}
          className="px-6 py-3 bg-[#F65C45] hover:bg-[#E04B35] text-white font-black text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <Download size={14} />
          <span>Download Feast Image (.png)</span>
        </button>

        <button
          onClick={handleShare}
          className="px-5 py-3 bg-[#FFFCF7] hover:bg-white text-[#2F1D1D] border border-[#EADBCC] font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
        >
          <Share2 size={14} />
          <span>Share Feast</span>
        </button>

        <button
          onClick={onResetFeast}
          className="px-5 py-3 bg-[#FFF2DE] hover:bg-[#FFE9B8] text-[#2F1D1D] font-bold text-xs sm:text-sm rounded-full transition-all flex items-center gap-2 cursor-pointer"
        >
          <RotateCcw size={13} />
          <span>Order Another Feast</span>
        </button>

        <Link
          href="/home"
          className="px-5 py-3 bg-transparent text-[#7A6464] hover:text-[#2F1D1D] font-bold text-xs sm:text-sm transition"
        >
          Back to Explore
        </Link>
      </div>
    </div>
  );
}
