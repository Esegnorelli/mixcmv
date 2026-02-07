
import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Tag, 
  Calculator, 
  Package,
  Factory,
  Layers,
  Settings2,
  AlertTriangle,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

// --- Tipos ---
interface RecipeItem {
  ingredientName: string;
  weight: number; // proporção na receita base (kg)
}

interface Recipe {
  id: string;
  name: string;
  items: RecipeItem[];
}

const App: React.FC = () => {
  // --- Identidade Visual da Marca ---
  const brand = {
    darkRed: '#91000E',
    red: '#DE000C',
    orange: '#FFB500',
    gold: '#F4C71D',
    blue: '#00416B',
    bg: '#F8FAFC'
  };

  // --- 1. Insumos Base (Preço de Mercado por KG) ---
  const [marketPrices, setMarketPrices] = useState<Record<string, number>>({
    'Sal': 32.00,           
    'Caldo de Carne': 14.85, 
    'Caldo de Frango': 14.85,
    'Tempero Seco': 52.00
  });

  // --- 2. Catálogo de Mixes (Ficha Técnica) ---
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

  // --- 3. Custos Operacionais da Unidade de Produção ---
  const [operational, setOperational] = useState({
    fixedCosts: 39.40,  
    labor: 8.75,       
    packaging: 8.90,   
    batchDivisor: 6    
  });

  // --- 4. Estratégia de Precificação & Volume ---
  const [strategy, setStrategy] = useState({
    markup: 1.55,
    batchSize: 2.0 
  });

  // Preço de venda manual para simulações
  const [manualPrices, setManualPrices] = useState<Record<string, string>>({});

  // --- Cálculos de Engenharia ---
  const fixedPerBatch = operational.batchDivisor > 0 
    ? (operational.fixedCosts + operational.labor + operational.packaging) / operational.batchDivisor 
    : 0;

  const results = useMemo(() => {
    return recipes.map(recipe => {
      const costPerKg = recipe.items.reduce((acc, item) => {
        const price = marketPrices[item.ingredientName] || 0;
        return acc + (price * item.weight);
      }, 0);

      const ingredientsInBatch = costPerKg * strategy.batchSize;
      const totalBatchCost = ingredientsInBatch + fixedPerBatch;
      const suggestedPrice = totalBatchCost * strategy.markup;

      const currentPriceInput = manualPrices[recipe.id];
      const finalPrice = currentPriceInput !== undefined && currentPriceInput !== "" 
        ? parseFloat(currentPriceInput) 
        : suggestedPrice;

      const cmv = finalPrice > 0 ? (totalBatchCost / finalPrice) * 100 : 0;
      const profit = finalPrice - totalBatchCost;
      const margin = finalPrice > 0 ? (profit / finalPrice) * 100 : 0;

      return {
        ...recipe,
        costPerKg,
        totalBatchCost,
        suggestedPrice,
        finalPrice,
        displayPrice: currentPriceInput !== undefined ? currentPriceInput : suggestedPrice.toFixed(2),
        cmv,
        profit,
        margin
      };
    });
  }, [marketPrices, operational, strategy, manualPrices]);

  const updatePrice = (id: string, val: string) => {
    setManualPrices(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-900 pb-24">
      {/* HEADER INDUSTRIAL - Ajustado para evitar sobreposição */}
      <header 
        className="text-white relative overflow-hidden pb-32 pt-10 border-b-8 shadow-xl" 
        style={{ backgroundColor: brand.darkRed, borderBottomColor: brand.orange }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="p-5 rounded-[2rem] shadow-2xl border-4 border-white/20 transform -rotate-3" style={{ backgroundColor: brand.orange }}>
                <Factory style={{ color: brand.darkRed }} size={36} />
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
                <span className="text-3xl font-black tracking-tight" style={{ color: brand.orange }}>R$ {fixedPerBatch.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL - Ajustado com Z-Index e Margem Controlada */}
      <main className="max-w-7xl mx-auto px-6 -mt-20 relative z-20 space-y-10">
        
        {/* DASHBOARD DE CONFIGURAÇÃO (3 COLUNAS) */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* TABELA DE INSUMOS */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 transform transition-all hover:scale-[1.01]">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Tag size={16} style={{ color: brand.red }} /> Custo de Reposição (KG)
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

          {/* CUSTOS DE MANUFATURA */}
          <div className="rounded-[2.5rem] shadow-2xl p-8 border-4 flex flex-col justify-between" style={{ backgroundColor: brand.blue, borderColor: brand.gold }}>
            <div>
              <h2 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: brand.gold }}>
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
                      value={operational[item.key as keyof typeof operational] || ""}
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

          {/* ESTRATÉGIA COMERCIAL */}
          <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-8 flex flex-col gap-6">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Calculator size={16} style={{ color: brand.red }} /> Engenharia de Lote
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
                  style={{ color: brand.red }}
                />
                <span className="text-xl font-black text-slate-300">KG</span>
              </div>
            </div>

            <div className="p-5 rounded-3xl shadow-lg" style={{ backgroundColor: brand.red }}>
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

        {/* CATÁLOGO DE MIXES */}
        <section className="space-y-8">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl shadow-lg" style={{ backgroundColor: brand.red }}>
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
              <div key={mix.id} className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-full transform transition-all hover:-translate-y-2">
                
                {/* CABEÇALHO DO MIX */}
                <div className="p-8 text-center border-b border-slate-50 bg-slate-50/50">
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] block mb-3">Linha de Produção</span>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-4">{mix.name}</h3>
                  <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Custo Mix/KG</span>
                    <span className="text-lg font-black" style={{ color: brand.red }}>R$ {mix.costPerKg.toFixed(2)}</span>
                  </div>
                </div>

                <div className="p-8 space-y-8 flex-grow flex flex-col justify-between">
                  {/* COMPOSIÇÃO TÉCNICA */}
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

                  {/* RESULTADO FINANCEIRO */}
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
                            <span className="text-2xl font-black" style={{ color: brand.orange }}>R$</span>
                            <input 
                              type="number"
                              value={mix.displayPrice}
                              onChange={(e) => updatePrice(mix.id, e.target.value)}
                              className="w-full bg-transparent text-3xl font-black outline-none"
                              style={{ color: brand.orange }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* MÉTRICAS */}
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

                    <div className="p-6 rounded-[2rem] flex justify-between items-center shadow-lg border border-orange-100" style={{ backgroundColor: brand.orange + '15' }}>
                      <span className="text-xs font-black text-slate-600 uppercase">Lucro Bruto Lote</span>
                      <div className="flex items-center gap-2 font-black text-2xl" style={{ color: brand.darkRed }}>
                        <TrendingUp size={24} />
                        R$ {mix.profit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* FOOTER CORPORATIVO */}
      <footer className="max-w-7xl mx-auto px-6 mt-24 text-center">
        <div className="flex justify-center gap-3 mb-10">
          {[brand.darkRed, brand.red, brand.orange, brand.gold].map((c, idx) => (
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
