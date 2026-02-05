
import React, { useState, useMemo } from 'react';
import { 
  FlaskConical, 
  Truck, 
  Settings, 
  TrendingUp, 
  Calculator,
  Package,
  AlertCircle
} from 'lucide-react';

// Definição dos tipos de Mix
enum MixType {
  MOIDA = 'Mix Moída',
  PICADA = 'Mix Picado',
  FRANGO = 'Mix Frango'
}

// Proporções exatas conforme solicitado
const MIX_PROPORTIONS = {
  [MixType.MOIDA]: { 'Sal': 0.165, 'Caldo de Carne': 0.835 },
  [MixType.PICADA]: { 'Sal': 0.334, 'Caldo de Carne': 0.334, 'Tempero Seco': 0.334 },
  [MixType.FRANGO]: { 'Sal': 0.250, 'Caldo de Frango': 0.750 }
};

const App: React.FC = () => {
  // 1. Preços dos Insumos (R$ por kg) - Podem ser inicializados via ENV
  // Fix: Replaced import.meta.env with process.env to resolve TypeScript 'ImportMeta' errors
  const [prices, setPrices] = useState({
    sal: Number(process.env.VITE_PRECO_SAL) || 2.50,
    caldoCarne: Number(process.env.VITE_PRECO_CALDO_CARNE) || 35.00,
    caldoFrango: Number(process.env.VITE_PRECO_CALDO_FRANGO) || 32.00,
    temperoSeco: Number(process.env.VITE_PRECO_TEMPERO_SECO) || 45.00
  });

  // 2. Configuração de Logística - Valores fornecidos como padrão ou via ENV
  // Fix: Replaced import.meta.env with process.env to resolve TypeScript 'ImportMeta' errors
  const [logistics, setLogistics] = useState({
    servico: Number(process.env.VITE_LOGISTICA_SERVICO) || 39.40,
    maoPropria: Number(process.env.VITE_LOGISTICA_MAO_PROPRIA) || 8.75,
    embalagem: Number(process.env.VITE_LOGISTICA_EMBALAGEM) || 8.90,
    capacidade: Number(process.env.VITE_LOGISTICA_CAPACIDADE) || 6
  });

  // 3. Estado da Calculadora Atual
  const [selectedMix, setSelectedMix] = useState<MixType>(MixType.MOIDA);
  const [quantityKg, setQuantityKg] = useState<number>(1);
  const [sellingPrice, setSellingPrice] = useState<number>(100.00);

  // Lógica Matemática de Custo, CMV e Markup
  const results = useMemo(() => {
    const proportions = MIX_PROPORTIONS[selectedMix];
    
    // Custo de Insumos por KG do Mix selecionado
    let costPerKg = 0;
    if (proportions['Sal']) costPerKg += proportions['Sal'] * prices.sal;
    if ('Caldo de Carne' in proportions) costPerKg += (proportions as any)['Caldo de Carne'] * prices.caldoCarne;
    if ('Caldo de Frango' in proportions) costPerKg += (proportions as any)['Caldo de Frango'] * prices.caldoFrango;
    if ('Tempero Seco' in proportions) costPerKg += (proportions as any)['Tempero Seco'] * prices.temperoSeco;

    const totalIngredientCost = costPerKg * quantityKg;

    // Custo Logístico por Unidade (Total da caixa / capacidade)
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12 font-sans">
      {/* Header Estilizado */}
      <header className="bg-yellow-500 shadow-md p-6 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="text-red-600" size={32} />
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Hora do Pastel <span className="text-red-700">| Mix Lab</span></h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-bold text-yellow-100 uppercase tracking-widest bg-yellow-600 px-3 py-1 rounded-full">
            <Settings size={14} /> Env Ready
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Seção de Configurações (Esquerda) */}
          <div className="lg:col-span-1 space-y-6">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-500 uppercase tracking-wider">
                <Settings className="text-yellow-500" size={18} /> Insumos (R$/kg)
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Sal', key: 'sal' },
                  { label: 'Caldo Carne', key: 'caldoCarne' },
                  { label: 'Caldo Frango', key: 'caldoFrango' },
                  { label: 'Tempero Seco', key: 'temperoSeco' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <label className="text-xs font-semibold text-slate-600">{item.label}</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-yellow-400">
                      <span className="text-slate-400 text-xs mr-1">R$</span>
                      <input 
                        type="number" 
                        className="w-20 bg-transparent text-right font-bold outline-none text-sm"
                        value={prices[item.key as keyof typeof prices]}
                        onChange={e => setPrices({...prices, [item.key]: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-sm font-bold mb-4 flex items-center gap-2 text-slate-500 uppercase tracking-wider">
                <Truck className="text-blue-500" size={18} /> Logística (Editável)
              </h2>
              <div className="space-y-4">
                {[
                  { label: 'Serviço/Correio', key: 'servico' },
                  { label: 'Mão Própria', key: 'maoPropria' },
                  { label: 'Embalagem', key: 'embalagem' }
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-4">
                    <label className="text-xs font-semibold text-slate-600">{item.label}</label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                      <span className="text-slate-400 text-xs mr-1">R$</span>
                      <input 
                        type="number" 
                        className="w-20 bg-transparent text-right font-bold outline-none text-sm"
                        value={logistics[item.key as keyof typeof logistics]}
                        onChange={e => setLogistics({...logistics, [item.key]: parseFloat(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                  <label className="text-xs font-bold text-blue-600 uppercase">Capac. p/ Caixa</label>
                  <input 
                    type="number" 
                    className="w-20 bg-blue-50 border border-blue-200 rounded-xl px-3 py-1.5 font-bold outline-none text-sm text-center"
                    value={logistics.capacidade}
                    onChange={e => setLogistics({...logistics, capacidade: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Seção de Calculadora (Direita) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-700">
                <Calculator className="text-red-500" size={22} /> Calculadora de Lote de Produção
              </h2>
              
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo de Mix</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {Object.values(MixType).map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedMix(type)}
                        className={`py-4 px-4 rounded-2xl text-center font-bold transition-all border-2 ${selectedMix === type ? 'bg-yellow-500 text-white border-yellow-500 shadow-lg scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-yellow-200'}`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Quantidade Produzida (KG)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black outline-none text-2xl focus:border-yellow-400 transition-colors"
                      value={quantityKg}
                      onChange={e => setQuantityKg(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Preço de Venda do Lote (R$)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-black outline-none text-2xl text-green-600 focus:border-green-400 transition-colors"
                      value={sellingPrice}
                      onChange={e => setSellingPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Painel de Resultados */}
            <section className="bg-slate-900 rounded-[2rem] shadow-2xl p-8 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 opacity-5">
                <TrendingUp size={240} />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500/20 p-2 rounded-lg">
                      <TrendingUp className="text-green-400" size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Relatório do Mix</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Custo Total / Unit</span>
                    <p className="text-3xl font-black text-yellow-500">R$ {results.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Custo Insumos</span>
                    <p className="text-xl font-bold">R$ {results.ingredient.toFixed(2)}</p>
                  </div>
                  <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700/50">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Rateio Logística</span>
                    <p className="text-xl font-bold">R$ {results.logistic.toFixed(2)}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border-2 flex flex-col justify-center ${results.cmv > 35 ? 'border-red-500/50 bg-red-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
                    <span className="text-[10px] font-bold uppercase block opacity-60 mb-1 text-center">CMV Final</span>
                    <p className={`text-3xl font-black text-center ${results.cmv > 35 ? 'text-red-400' : 'text-green-400'}`}>
                      {results.cmv.toFixed(1)}%
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
                  <div className="flex-1 w-full bg-blue-600 rounded-2xl p-6 flex items-center justify-between shadow-lg shadow-blue-900/20">
                    <div>
                      <span className="text-[10px] font-bold text-blue-200 uppercase block">Markup Calculado</span>
                      <p className="text-4xl font-black">{results.markup.toFixed(2)}<span className="text-xl font-bold ml-1 text-blue-300">x</span></p>
                    </div>
                    <div className="bg-white/10 p-3 rounded-full">
                      <TrendingUp size={32} />
                    </div>
                  </div>
                  
                  {results.cmv > 35 && (
                    <div className="w-full md:w-auto bg-red-600/20 border border-red-500/50 p-4 rounded-2xl flex items-center gap-3">
                      <AlertCircle className="text-red-500 shrink-0" size={24} />
                      <p className="text-xs font-bold text-red-300 leading-tight">
                        ALERTA: O CMV ultrapassou os 35%. <br/>Avalie o preço de venda ou custos.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 mt-8">
        <div className="flex flex-col items-center justify-center gap-2 text-slate-400 border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2">
            <Package size={14} />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Gestão de Mixes | Hora do Pastel</span>
          </div>
          <p className="text-[9px] font-medium opacity-50 uppercase tracking-widest text-center max-w-xs leading-relaxed">
            Desenvolvido para ambiente Vite. Configure variáveis no arquivo .env para alterar os valores padrão sem modificar o código.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
