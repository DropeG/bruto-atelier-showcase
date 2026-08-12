import React, { useState } from 'react';
import { useShopifyStatus } from '@/hooks/useShopifyStatus';
import { Store, CheckCircle2, AlertCircle, RefreshCw, ChevronUp, ChevronDown } from 'lucide-react';

export const ShopifyStatusIndicator: React.FC = () => {
  const { status, isLoading, refetchStatus } = useShopifyStatus();
  const [isOpen, setIsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    await refetchStatus();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 font-sans text-xs select-none">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-stone-900/90 text-stone-200 border border-stone-800 rounded-full shadow-lg backdrop-blur-md cursor-pointer hover:bg-stone-900 transition-all duration-300 group"
      >
        <Store className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-200 transition-colors" />

        <div className="flex items-center gap-1.5">
          <span className="font-medium tracking-wider uppercase text-[10px]">Shopify:</span>
          {isLoading ? (
            <span className="text-amber-400/90 flex items-center gap-1">
              <RefreshCw className="w-3 h-3 animate-spin" /> Conectando...
            </span>
          ) : status.isLive ? (
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Live API
            </span>
          ) : (
            <span className="text-amber-300/90 font-medium flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Mock Mode
            </span>
          )}
        </div>

        {isOpen ? (
          <ChevronDown className="w-3 h-3 text-stone-400" />
        ) : (
          <ChevronUp className="w-3 h-3 text-stone-400" />
        )}
      </div>

      {isOpen && (
        <div className="absolute bottom-12 right-0 w-72 bg-stone-950/95 border border-stone-800 text-stone-300 rounded-xl p-4 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5 mb-3">
            <h4 className="font-serif text-sm tracking-wide text-stone-100 flex items-center gap-2">
              <Store className="w-4 h-4 text-stone-400" /> Conexión Shopify
            </h4>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1 text-stone-400 hover:text-stone-100 rounded hover:bg-stone-800/60 transition-colors disabled:opacity-50"
              title="Revisar conexión"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-2 text-[11px] leading-relaxed text-stone-400">
            <div className="flex justify-between items-center py-0.5">
              <span>Estado:</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                  status.isLive
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50'
                    : 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                }`}
              >
                {status.isLive ? 'Conectado (Live API)' : 'Modo Mock / Fallback'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span>Dominio:</span>
              <span className="font-mono text-stone-200 text-[10px] truncate max-w-[140px]" title={status.domain}>
                {status.domain || 'N/A'}
              </span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span>Versión API:</span>
              <span className="font-mono text-stone-300 text-[10px]">{status.apiVersion || '2024-07'}</span>
            </div>

            {status.shopInfo && (
              <div className="pt-2 mt-2 border-t border-stone-800/60 space-y-1">
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Tienda:</p>
                <p className="text-stone-200 font-serif">{status.shopInfo.name}</p>
                <p className="text-[10px] text-stone-400">
                  Moneda Base: <span className="font-mono text-stone-200">{status.shopInfo.paymentSettings?.currencyCode || 'CLP'}</span>
                </p>
              </div>
            )}

            {status.error && (
              <div className="mt-3 p-2 bg-stone-900/80 border border-stone-800 rounded text-[10px] text-amber-200/90 leading-tight">
                {status.error}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
