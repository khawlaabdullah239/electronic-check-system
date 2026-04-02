import { useRef, useEffect } from 'react';
import QRious from 'qrious';

const QRCodeDisplay = ({ data, url, size = 200 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && (data || url)) {
      const value = url || (typeof data === 'string' ? data : JSON.stringify(data));
      new QRious({
        element: canvasRef.current,
        value,
        size,
        background: '#FFFFFF',
        foreground: '#0F172A',
        level: 'H',
      });
    }
  }, [data, url, size]);

  if (!data && !url) return null;

  return (
    <div className="inline-block p-4 bg-white rounded-xl border border-[#E2E8F0] shadow-sm">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

export default QRCodeDisplay;
