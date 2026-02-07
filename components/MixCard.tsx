
import React from 'react';
import { Package, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';
import { MixResult } from '../types';
import { BRAND } from '../constants';

interface MixCardProps {
  mix: MixResult;
  updatePrice: (id: string, val: string) => void;
}

export const MixCard: React.FC<MixCardProps> = ({ mix, updatePrice }) => (
  <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-2">
    <div className="p-8 text-center border-b border-slate-50 bg-slate-50/50">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-3">Linha de Produção</span>
      <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-4">{mix.name}</h3>
      <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <span className="text-[10px] font-black text-slate-400 uppercase">Custo Mix/KG</span>
        <span className="text-lg font-black" style={{ color: BRAND.red }}>R$ {mix.costPerKg.toFixed(2)}</span>
      </div>
    </div>

    <div className="p-8 space-y-8 flex-grow flex flex-col justify-between">
      <div className="space-y-4">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
          Ingredientes p/ 1KG <span className="w-1/2 h-[1px] bg-slate-100"></span>
        </h4>
        <div className="space-y-2">
          {mix.items.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors">
              <span className="font-bold text-slate-600 uppercase tracking-tight">{item.ingredientName}</span>
              <span className="font-black text-slate-900 bg-white px-2 py-1 rounded-lg shadow-sm">{(item.weight * 1000).toFixed(0)}g</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Package size={80} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <span className="text-[10px] font-black text-white/40 uppercase">Custo Total Lote</span>
              <span className="text-2xl font-black">R$ {mix.totalBatchCost.toFixed(2)}</span>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/40 uppercase block">Preço de Venda do Lote</label>
              <div className="flex items-center gap-3 p-4 rounded-3xl border-2 border-white/10 bg-white/5 transition-all focus-within:border-white/40">
                <span className="text-2xl font-black" style={{ color: BRAND.orange }}>R$</span>
                <input 
                  type="number"
                  value={mix.displayPrice}
                  onChange={(e) => updatePrice(mix.id, e.target.value)}
                  className="w-full bg-transparent text-3xl font-black outline-none"
                  style={{ color: BRAND.orange }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50 shadow-inner">
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">CMV Operacional</span>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-black ${mix.cmv > 40 ? 'text-red-600' : 'text-green-600'}`}>
                {mix.cmv.toFixed(1)}%
              </span>
              {mix.cmv > 40 ? <AlertTriangle size={16} className="text-red-500" /> : <CheckCircle2 size={16} className="text-green-500" />}
            </div>
          </div>
          <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50 text-right shadow-inner">
            <span className="text-[9px] font-black text-slate-400 uppercase block mb-2">Margem Real</span>
            <span className="text-xl font-black text-slate-800">
              {mix.margin.toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="p-6 rounded-[2rem] flex justify-between items-center shadow-lg border border-orange-100" style={{ backgroundColor: BRAND.orange + '15' }}>
          <span className="text-xs font-black text-slate-600 uppercase">Lucro Bruto Lote</span>
          <div className="flex items-center gap-2 font-black text-2xl" style={{ color: BRAND.darkRed }}>
            <TrendingUp size={24} />
            R$ {mix.profit.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  </div>
);
