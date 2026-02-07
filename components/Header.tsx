
import React from 'react';
import { Factory } from 'lucide-react';
import { BRAND } from '../constants';

interface HeaderProps {
  fixedPerBatch: number;
}

export const Header: React.FC<HeaderProps> = ({ fixedPerBatch }) => (
  <header 
    className="text-white relative overflow-hidden pb-32 pt-10 border-b-8 shadow-xl" 
    style={{ backgroundColor: BRAND.darkRed, borderBottomColor: BRAND.orange }}
  >
    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-6">
          <div className="p-5 rounded-[2rem] shadow-2xl border-4 border-white/20 transform -rotate-3" style={{ backgroundColor: BRAND.orange }}>
            <Factory style={{ color: BRAND.darkRed }} size={36} />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic leading-none">Hora do Pastel</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
              <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-[0.2em]">Sistemas de Produção de Mixes</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="bg-black/20 backdrop-blur-xl p-5 rounded-3xl border border-white/10 text-right shadow-lg">
            <span className="text-[10px] font-black text-white/40 uppercase block mb-1">Custo Operacional Lote</span>
            <span className="text-3xl font-black tracking-tight" style={{ color: BRAND.orange }}>R$ {fixedPerBatch.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);
