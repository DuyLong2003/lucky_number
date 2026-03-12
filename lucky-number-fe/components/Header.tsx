import { getTenantConfig, TenantConfig } from '../services/api';
import React from 'react';
import { useSearchParams } from 'react-router-dom';

export const Header: React.FC = () => {
  const [searchParams] = useSearchParams();

  const tenantId = searchParams.get('tenant') || '';
  const [config, setConfig] = React.useState<TenantConfig | null>(null);
  React.useEffect(() => {
    if (tenantId) {
      getTenantConfig(tenantId).then(setConfig).catch(console.error);
    }
  }, [tenantId]);

  return (
    <header className="py-8 text-center bg-surface border-b-4 border-primary shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary/30" />
      <div className="container mx-auto px-4 relative z-10">
        <h1 className="font-festive text-5xl md:text-7xl text-primary drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)] mb-2 animate-float uppercase tracking-tight">
          Xuân Bính Ngọ 2026
        </h1>
        <p className="text-text-main text-lg md:text-xl font-black tracking-[0.2em] uppercase opacity-90">
          ✦ Quay số trúng thưởng ✦
        </p>
        <p className="text-text-muted text-sm md:text-base font-bold tracking-widest uppercase mt-1">
          Chương trình gặp mặt cuối năm
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <span className="text-2xl filter drop-shadow-md">🌸</span>
          <div className="h-0.5 w-32 bg-primary/40 self-center rounded-full"></div>
          <span className="text-2xl filter drop-shadow-md">🌸</span>
        </div>
      </div>
      {/* {config?.customLogoUrl && (
        <div className="flex justify-center mb-0">
          <img src={config.customLogoUrl} alt="Logo" className="h-20 object-contain drop-shadow-lg" />
        </div>
      )} */}
    </header>
  );
};
