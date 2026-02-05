
import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Truck, 
  Settings, 
  TrendingUp, 
  Calculator,
  DollarSign,
  Package
} from 'lucide-react';

// Definitions
enum MixType {
  MOIDA = 'Mix Moída',
  PICADA = 'Mix Picado',
  FRANGO = 'Mix Frango'
}

const MIX_PROPORTIONS = {
  [MixType.MOIDA]: { 'Sal': 0.165, 'Caldo de Carne': 0.835 },
  [MixType.PICADA]: { 'Sal': 0.334, 'Caldo de Carne': 0.334, 'Tempero Seco': 0.334 },
  [MixType.FRANGO]: { 'Sal': 0.250, 'Caldo de Frango': 0.750 }
};

const App: React.FC = () => {
  // 1. Ingredients Prices (R$ per kg)
  const [prices, setPrices] = useState({
    sal: 2.50,
    caldoCarne: 35.00,
    caldoFrango: 32.00,
    temperoSeco: 45.00
  });

  // 2. Logistics Config
  const [logistics, setLogistics] = useState({
    servico: 39.40,
    maoPropria: 8.75,
    embalagem: 8.90,
    capacidade: 6
  });

  // 3. Current Calculation
  const [selectedMix, setSelectedMix] = useState<MixType>(MixType.MOIDA);
  const [quantityKg, setQuantityKg] = useState<number>(1);
  const [sellingPrice, setSellingPrice] = useState<number>(100.00);

  // Math Logic
  const results = useMemo(() => {
    const proportions = MIX_PROPORTIONS[selectedMix];
    
    // Ingredient Cost per KG of Mix
    let costPerKg = 0;
    if (proportions['Sal']) costPerKg += proportions['Sal'] * prices.sal;
    if (proportions['Caldo de Carne']) costPerKg += proportions['Caldo de Carne'] * prices.caldoCarne;
    if (proportions['Caldo de Frango']) costPerKg += proportions['Caldo de Frango'] * prices.caldoFrango;
    if (proportions['Tempero Seco']) costPerKg += proportions['Tempero Seco'] * prices.temperoSeco;

    const totalIngredientCost = costPerKg * quantityKg;

    // Logistic Cost per Unit
    const totalLogisticPerBox = logistics.servico + logistics.maoPropria + logistics.embalagem;
    const logisticUnitCost = totalLogisticPerBox / logistics.capacidade;

    const totalCost = totalIngredientCost + logisticUnitCost;
    const markup = totalCost > 0 ? sellingPrice / totalCost : 0;
    const cmv = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;

    return {
      ingredient: totalIngredientCost,
      logistic: logisticUnitCost,
      total: totalCost,
      markup,
      cmv
    };
  }, [selectedMix, quantityKg, sellingPrice, prices, logistics]);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-yellow-500 shadow-md p-6 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="text-red-600" size={32} />
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Hora do Pastel <span className="text-red-700">| Mix Lab</span></h1>
          </div>
          <div className="hidden md:block text-xs font-bold text-yellow-100 uppercase tracking-widest">Calculadora de CMV & Markup</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Column 1: Configs */}
          <div className="space-y-8">
            {/* Prices Section */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
                <Settings className="text-yellow-500" size={20} /> Preços dos Insumos (R$/kg)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Sal', key: 'sal' },
                  { label: 'Caldo Carne', key: 'caldoCarne' },
                  { label: 'Caldo Frango', key: 'caldoFrango' },
                  { label: 'Tempero Seco', key: 'temperoSeco' }
                ].map(item => (
                  <div key={item.key} className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                      <span className="text-slate-400 text-sm">R$</span>
                      <input 
                        type="number" 
                        className="w-full bg-transparent text-right font-bold outline-none"
                        value={prices[item.key as keyof typeof prices]}
                        onChange={e => setPrices({...prices, [item.key]: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Logistics Section */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-700">
                <Truck className="text-blue-500" size={20} /> Logística (Editável)
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Serviço/Correio</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none"
                      value={logistics.servico}
                      onChange={e => setLogistics({...logistics, servico: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Mão Própria</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none"
                      value={logistics.maoPropria}
                      onChange={e => setLogistics({...logistics, maoPropria: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Embalagem</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none"
                      value={logistics.embalagem}
                      onChange={e => setLogistics({...logistics, embalagem: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Capacidade p/ Caixa</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold outline-none text-blue-600"
                      value={logistics.capacidade}
                      onChange={e => setLogistics({...logistics, capacidade: parseInt(e.target.value) || 1})}
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Column 2: Calculator & Result */}
          <div className="space-y-8">
            {/* Calculation Inputs */}
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
                <Calculator className="text-red-500" size={20} /> Calculadora de Lote
              </h2>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Selecione o Mix</label>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.values(MixType).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedMix(type)}
                        className={`py-3 px-4 rounded-xl text-left font-bold transition-all ${selectedMix === type ? 'bg-yellow-500 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Qtde Produzida (KG)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none text-lg"
                      value={quantityKg}
                      onChange={e => setQuantityKg(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">Preço de Venda (R$)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold outline-none text-lg text-green-600"
                      value={sellingPrice}
                      onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Results Display */}
            <section className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={120} />
              </div>
              
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <TrendingUp className="text-green-400" size={24} />
                <h2 className="text-xl font-black uppercase tracking-widest">Resultado do Mix</h2>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Custo Insumos</span>
                  <p className="text-xl font-bold">R$ {results.ingredient.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Custo Logístico</span>
                  <p className="text-xl font-bold">R$ {results.logistic.toFixed(2)}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Custo Total Unitário</span>
                <p className="text-3xl font-black text-yellow-500">R$ {results.total.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-2xl border ${results.cmv > 35 ? 'border-red-500 bg-red-500/10' : 'border-green-500 bg-green-500/10'}`}>
                  <span className="text-[10px] font-bold uppercase block opacity-70">CMV</span>
                  <span className="text-2xl font-black">{results.cmv.toFixed(1)}%</span>
                </div>
                <div className="p-4 rounded-2xl border border-blue-500 bg-blue-500/10">
                  <span className="text-[10px] font-bold uppercase block opacity-70">Markup</span>
                  <span className="text-2xl font-black">{results.markup.toFixed(2)}x</span>
                </div>
              </div>

              {results.cmv > 35 && (
                <div className="bg-red-500 text-white text-[10px] font-black p-2 rounded-lg text-center animate-pulse uppercase">
                  Alerta: CMV acima do ideal (35%)
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <Package size={14} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Gestão de Mixes | Hora do Pastel © 2024</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
