
import React, { useState, useMemo } from 'react';
import { Tag, Calculator, Settings2, Layers, ChevronDown } from 'lucide-react';
import { Recipe, OperationalCosts, Strategy } from './types';
import { BRAND, DEFAULT_MARKET_PRICES, DEFAULT_OPERATIONAL, DEFAULT_STRATEGY } from './constants';
import { calculateFixedPerBatch, calculateResults } from './utils/calculations';
import { Header } from './components/Header';
import { MixCard } from './components/MixCard';

const recipes: Recipe[] = [
  {
    id: 'moida',
    name: 'Mix Carne Moída',
    items: [
      { ingredientName: 'Sal', weight: 0.165 },
      { ingredientName: 'Caldo de Carne', weight: 0.835 },
    ]
  },
  {
    id: 'frango',
    name: 'Mix Frango Desfiado',
    items: [
      { ingredientName: 'Sal', weight: 0.250 },
      { ingredientName: 'Caldo de Frango', weight: 0.750 },
    ]
  },
  {
    id: 'picado',
    name: 'Mix Tempero Picado',
    items: [
      { ingredientName: 'Sal', weight: 0.334 },
      { ingredientName: 'Caldo de Carne', weight: 0.334 },
      { ingredientName: 'Tempero Seco', weight: 0.334 },
    ]
  }
];

const App: React.FC = () => {
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>(DEFAULT_MARKET_PRICES);
  const [operational, setOperational] = useState<OperationalCosts>(DEFAULT_OPERATIONAL);
  const [strategy, setStrategy] = useState<Strategy>(DEFAULT_STRATEGY);
  const [manualPrices, setManualPrices] = useState<Record<string, string>>({});

  const fixedPerBatch = useMemo(() => calculateFixedPerBatch(operational), [operational]);
  
  const results = useMemo(() => 
    calculateResults(recipes, marketPrices, operational, strategy, manualPrices),
    [marketPrices, operational, strategy, manualPrices]
  );

  const updateManualPrice = (id: string, val: string) => {
    setManualPrices(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-24">
      <Header fixedPerBatch={fixedPerBatch} />

      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* INSUMOS */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 transform transition-all hover:scale-[1.01]">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Tag size={16} style={{ color: BRAND.red }} /> Custo de Reposição (KG)
            </h2>
            <div className="space-y-3">
              {Object.keys(marketPrices).map(name => (
                <div key={name} className="flex items-center justify-between bg-slate-50 p-3.5 rounded-2xl border border-slate-100 hover:border-red-200 transition-all group">
                  <span className="text-[11px] font-bold text-slate-600 uppercase">{name}</span>
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 focus-within:ring-4 focus-within:ring-red-500/10">
                    <span className="text-[10px] font-black text-slate-300">R$</span>
                    <input 
                      type="number"
                      value={marketPrices[name] || ""}
                      onChange={(e) => setMarketPrices({...marketPrices, [name]: parseFloat(e.target.value) || 0})}
                      className="w-16 bg-transparent text-right font-black text-sm outline-none text-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* MANUFATURA */}
          <div className="rounded-[2.5rem] shadow-2xl p-8 border-4 flex flex-col justify-between" style={{ backgroundColor: BRAND.blue, borderColor: BRAND.gold }}>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: BRAND.gold }}>
                <Settings2 size={16} /> Manufatura & Lotes
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Fixos (Energia/Aluguel)', key: 'fixedCosts' },
                  { label: 'Mão de Obra Lote', key: 'labor' },
                  { label: 'Potes/Etiquetas Lote', key: 'packaging' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-white/60 uppercase">{item.label}</span>
                    <input 
                      type="number"
                      value={operational[item.key as keyof OperationalCosts] || ""}
                      onChange={(e) => setOperational({...operational, [item.key]: parseFloat(e.target.value) || 0})}
                      className="w-20 bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-right font-black text-sm text-white outline-none focus:bg-white/20 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 p-5 rounded-2xl bg-black/20 border border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-white/40 uppercase leading-none">Divisor de<br/>Rateio</span>
                <input 
                  type="number"
                  value={operational.batchDivisor || ""}
                  onChange={(e) => setOperational({...operational, batchDivisor: parseInt(e.target.value) || 1})}
                  className="w-14 bg-white text-blue-900 rounded-xl py-2 text-center font-black text-lg shadow-inner"
                />
              </div>
              <div className="text-right">
                <span className="text-[9px] font-black text-white/40 uppercase block">Impacto Unit.</span>
                <span className="text-xl font-black text-white">R$ {fixedPerBatch.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* ESTRATÉGIA */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 flex flex-col gap-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calculator size={16} style={{ color: BRAND.red }} /> Engenharia de Lote
            </h2>
            
            <div className="p-5 rounded-3xl border-2 border-slate-100 bg-slate-50/50">
              <label className="text-[9px] font-black text-slate-400 uppercase block mb-2">Peso de Produção do Lote</label>
              <div className="flex items-center gap-3">
                <input 
                  type="number"
                  step="0.5"
                  value={strategy.batchSize || ""}
                  onChange={(e) => setStrategy({...strategy, batchSize: parseFloat(e.target.value) || 0})}
                  className="w-full text-4xl font-black bg-transparent outline-none"
                  style={{ color: BRAND.red }}
                />
                <span className="text-xl font-black text-slate-300">KG</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl shadow-lg" style={{ backgroundColor: BRAND.red }}>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[9px] font-black text-white/50 uppercase">Markup Planejado</label>
                <input 
                  type="number"
                  step="0.05"
                  value={strategy.markup || ""}
                  onChange={(e) => setStrategy({...strategy, markup: parseFloat(e.target.value) || 0})}
                  className="w-16 bg-transparent text-right font-black text-2xl text-white outline-none"
                />
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full mt-3">
                <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${Math.min((strategy.markup / 3) * 100, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: BRAND.red }}>
                <Layers size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Fichas de Produção Ativas</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base de custos técnica atualizada</p>
              </div>
            </div>
            <ChevronDown className="text-slate-300" size={32} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.map(mix => (
              <MixCard 
                key={mix.id} 
                mix={mix} 
                updatePrice={updateManualPrice} 
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="max-w-7xl mx-auto px-6 mt-24 text-center">
        <div className="flex justify-center gap-3 mb-10">
          {[BRAND.darkRed, BRAND.red, BRAND.orange, BRAND.gold].map((c, idx) => (
            <div key={c} className={`h-2 w-16 rounded-full shadow-sm ${idx % 2 === 0 ? 'animate-pulse' : ''}`} style={{ backgroundColor: c }}></div>
          ))}
        </div>
        <p className="text-[14px] font-black uppercase tracking-[0.5em] text-slate-400">Hora do Pastel</p>
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest italic mt-2">Sistemas de Alta Performance para Gestão Industrial v2.5</p>
      </footer>
    </div>
  );
};

export default App;
