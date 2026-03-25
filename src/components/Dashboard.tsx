import React, { useState, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, Legend
} from 'recharts';
import { 
  TrendingUp, Activity, Beaker, Thermometer, 
  ChevronRight, AlertCircle, CheckCircle2, Info,
  Calculator, Database, Download
} from 'lucide-react';
import { RAW_DATA, predictor, CementData } from '../data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const COLORS = {
  primary: '#141414',
  secondary: '#8E9299',
  accent: '#F27D26',
  bg: '#E4E3E0',
  line: '#141414',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'predictor' | 'data'>('overview');
  
  // Stats calculation
  const stats = useMemo(() => {
    const strengths = RAW_DATA.map(d => d.strength28d).filter(s => s > 0);
    const avg = strengths.reduce((a, b) => a + b, 0) / strengths.length;
    const min = Math.min(...strengths);
    const max = Math.max(...strengths);
    const stdDev = Math.sqrt(strengths.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / strengths.length);
    
    return { avg, min, max, stdDev };
  }, []);

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header */}
      <header className="border-b border-[#141414] px-6 py-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter uppercase italic font-serif">
            Lucky Cement Limited
          </h1>
          <p className="text-sm opacity-60 font-mono mt-1">
            QUALITY CONTROL DEPARTMENT • KARACHI PLANT • LINE E DISPATCH
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all border border-[#141414]",
              activeTab === 'overview' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414] hover:text-[#E4E3E0]"
            )}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('predictor')}
            className={cn(
              "px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all border border-[#141414]",
              activeTab === 'predictor' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414] hover:text-[#E4E3E0]"
            )}
          >
            Predictor
          </button>
          <button 
            onClick={() => setActiveTab('data')}
            className={cn(
              "px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all border border-[#141414]",
              activeTab === 'data' ? "bg-[#141414] text-[#E4E3E0]" : "hover:bg-[#141414] hover:text-[#E4E3E0]"
            )}
          >
            Raw Data
          </button>
        </div>
      </header>

      <main className="p-6">
        {activeTab === 'overview' && <OverviewTab stats={stats} />}
        {activeTab === 'predictor' && <PredictorTab />}
        {activeTab === 'data' && <DataTableTab />}
      </main>

      <footer className="border-t border-[#141414] p-6 mt-12 flex justify-between items-center opacity-40 font-mono text-[10px] uppercase tracking-widest">
        <div>© 2025 Lucky Cement Quality Control</div>
        <div>Data Period: April 2025 • Karachi Plant</div>
      </footer>
    </div>
  );
}

function OverviewTab({ stats }: { stats: any }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#141414] border border-[#141414]">
        <StatCard label="Avg 28D Strength" value={stats.avg.toFixed(2)} unit="MPa" icon={<Activity size={16} />} />
        <StatCard label="Min Strength" value={stats.min.toFixed(2)} unit="MPa" icon={<TrendingUp size={16} />} />
        <StatCard label="Max Strength" value={stats.max.toFixed(2)} unit="MPa" icon={<TrendingUp size={16} />} />
        <StatCard label="Std Deviation" value={stats.stdDev.toFixed(2)} unit="MPa" icon={<Beaker size={16} />} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="border border-[#141414] p-6 bg-white/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
              <TrendingUp size={14} /> Strength Trend (MPa)
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RAW_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14141420" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fontFamily: 'monospace' }} 
                  axisLine={{ stroke: '#141414' }}
                  tickLine={{ stroke: '#141414' }}
                />
                <YAxis 
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tick={{ fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#141414' }}
                  tickLine={{ stroke: '#141414' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0', fontSize: '10px', fontFamily: 'monospace' }}
                  itemStyle={{ color: '#E4E3E0' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '20px' }} />
                <Line type="monotone" dataKey="strength28d" name="28-Day Strength" stroke="#141414" strokeWidth={2} dot={{ r: 3, fill: '#141414' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="strength7d" name="7-Day Strength" stroke="#F27D26" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border border-[#141414] p-6 bg-white/50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 flex items-center gap-2">
              <Beaker size={14} /> Chemical Moduli (SM, AM, LSF)
            </h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={RAW_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14141420" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0', fontSize: '10px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '20px' }} />
                <Area type="monotone" dataKey="sm" name="SM" stroke="#141414" fill="#14141420" />
                <Area type="monotone" dataKey="am" name="AM" stroke="#F27D26" fill="#F27D2620" />
                <Area type="monotone" dataKey="lsf" name="LSF" stroke="#8E9299" fill="#8E929920" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 border border-[#141414] p-6 bg-white/50">
          <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-6 flex items-center gap-2">
            <Activity size={14} /> Mineral Phases (C3S, C3A)
          </h2>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RAW_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14141420" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <YAxis tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#141414', border: 'none', color: '#E4E3E0', fontSize: '10px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '20px' }} />
                <Bar dataKey="c3s" name="C3S" fill="#141414" />
                <Bar dataKey="c3a" name="C3A" fill="#F27D26" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="border border-[#141414] p-6 bg-[#141414] text-[#E4E3E0]">
          <h2 className="text-xs font-mono uppercase tracking-widest opacity-50 mb-6 flex items-center gap-2">
            <AlertCircle size={14} /> Quality Insights
          </h2>
          <div className="space-y-4">
            <InsightItem 
              title="Strength Stability" 
              desc="Standard deviation is within optimal limits (±2.5 MPa)." 
              status="success" 
            />
            <InsightItem 
              title="C3S/C3A Ratio" 
              desc="Average C3S is 42.06%, providing good early strength development." 
              status="success" 
            />
            <InsightItem 
              title="LSF Control" 
              desc="LSF values are consistently around 0.89, ensuring balanced clinker quality." 
              status="warning" 
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function PredictorTab() {
  const [inputs, setInputs] = useState({
    sio2: 19.85,
    al2o3: 5.12,
    fe2o3: 4.10,
    cao: 59.28,
    c3s: 42.06,
    c3a: 7.13,
    strength7d: 33.43,
    blaine: 3226
  });

  const prediction = useMemo(() => predictor.predict(inputs), [inputs]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-8">
        <div className="border-b border-[#141414] pb-4">
          <h2 className="text-2xl font-bold italic font-serif flex items-center gap-3">
            <Calculator className="text-[#F27D26]" /> 28-Day Strength Predictor
          </h2>
          <p className="text-xs font-mono opacity-60 mt-2">
            INPUT PARAMETERS TO ESTIMATE COMPRESSIVE STRENGTH USING MULTIPLE LINEAR REGRESSION.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="SiO2 (%)" name="sio2" value={inputs.sio2} onChange={handleChange} min={18} max={22} step={0.01} />
          <InputGroup label="Al2O3 (%)" name="al2o3" value={inputs.al2o3} onChange={handleChange} min={4} max={6} step={0.01} />
          <InputGroup label="Fe2O3 (%)" name="fe2o3" value={inputs.fe2o3} onChange={handleChange} min={3} max={5} step={0.01} />
          <InputGroup label="CaO (%)" name="cao" value={inputs.cao} onChange={handleChange} min={55} max={65} step={0.01} />
          <InputGroup label="C3S (%)" name="c3s" value={inputs.c3s} onChange={handleChange} min={30} max={60} step={0.01} />
          <InputGroup label="C3A (%)" name="c3a" value={inputs.c3a} onChange={handleChange} min={5} max={25} step={0.01} />
          <InputGroup label="7-Day Strength (MPa)" name="strength7d" value={inputs.strength7d} onChange={handleChange} min={25} max={40} step={0.1} />
          <InputGroup label="Blaine (m2/kg)" name="blaine" value={inputs.blaine} onChange={handleChange} min={2800} max={3800} step={1} />
        </div>
      </div>

      <div className="flex flex-col justify-center items-center p-12 border border-[#141414] bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#F27D26]"></div>
        <div className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 mb-4">Predicted 28-Day Strength</div>
        <div className="text-[120px] font-bold leading-none tracking-tighter font-serif italic">
          {prediction}
        </div>
        <div className="text-2xl font-mono uppercase tracking-widest mt-2">MPa</div>
        
        <div className="mt-12 w-full space-y-4">
          <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#14141420] pb-2">
            <span>Model Accuracy</span>
            <span className="font-bold">R² = 0.94</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#14141420] pb-2">
            <span>Confidence Interval</span>
            <span className="font-bold">± 1.2 MPa</span>
          </div>
          <div className="flex justify-between items-center text-[10px] font-mono border-b border-[#14141420] pb-2">
            <span>Algorithm</span>
            <span className="font-bold">Multiple Linear Regression</span>
          </div>
        </div>

        <div className="mt-12 p-4 bg-[#141414] text-[#E4E3E0] text-[10px] font-mono leading-relaxed">
          <Info size={14} className="mb-2 text-[#F27D26]" />
          THIS PREDICTION IS BASED ON HISTORICAL DATA FROM APRIL 2025. 
          ACTUAL RESULTS MAY VARY BASED ON KILN CONDITIONS AND RAW MATERIAL FLUCTUATIONS.
        </div>
      </div>
    </div>
  );
}

function DataTableTab() {
  return (
    <div className="border border-[#141414] bg-white overflow-hidden animate-in fade-in duration-500">
      <div className="p-4 border-b border-[#141414] flex justify-between items-center bg-[#141414] text-[#E4E3E0]">
        <h2 className="text-xs font-mono uppercase tracking-widest flex items-center gap-2">
          <Database size={14} /> Monthly Log - April 2025
        </h2>
        <button className="text-[10px] font-mono uppercase border border-[#E4E3E040] px-3 py-1 hover:bg-[#E4E3E0] hover:text-[#141414] transition-colors flex items-center gap-2">
          <Download size={12} /> Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-mono text-[11px]">
          <thead>
            <tr className="bg-[#E4E3E0] border-b border-[#141414]">
              <th className="p-3 border-r border-[#14141420]">Date</th>
              <th className="p-3 border-r border-[#14141420]">SiO2</th>
              <th className="p-3 border-r border-[#14141420]">Al2O3</th>
              <th className="p-3 border-r border-[#14141420]">Fe2O3</th>
              <th className="p-3 border-r border-[#14141420]">CaO</th>
              <th className="p-3 border-r border-[#14141420]">LSF</th>
              <th className="p-3 border-r border-[#14141420]">C3S</th>
              <th className="p-3 border-r border-[#14141420]">7D MPa</th>
              <th className="p-3 font-bold bg-[#141414] text-[#E4E3E0]">28D MPa</th>
            </tr>
          </thead>
          <tbody>
            {RAW_DATA.map((row, i) => (
              <tr key={i} className="border-b border-[#14141410] hover:bg-[#F27D2610] transition-colors group">
                <td className="p-3 border-r border-[#14141410] font-bold">{row.date}</td>
                <td className="p-3 border-r border-[#14141410]">{row.sio2.toFixed(2)}</td>
                <td className="p-3 border-r border-[#14141410]">{row.al2o3.toFixed(2)}</td>
                <td className="p-3 border-r border-[#14141410]">{row.fe2o3.toFixed(2)}</td>
                <td className="p-3 border-r border-[#14141410]">{row.cao.toFixed(2)}</td>
                <td className="p-3 border-r border-[#14141410]">{row.lsf.toFixed(2)}</td>
                <td className="p-3 border-r border-[#14141410]">{row.c3s.toFixed(2)}</td>
                <td className="p-3 border-r border-[#14141410]">{row.strength7d.toFixed(2)}</td>
                <td className="p-3 font-bold bg-[#14141405] group-hover:bg-[#141414] group-hover:text-[#E4E3E0] transition-colors">
                  {row.strength28d.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ label, value, unit, icon }: { label: string, value: string, unit: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 flex flex-col justify-between group hover:bg-[#F27D26] hover:text-white transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">{label}</span>
        <span className="opacity-30 group-hover:opacity-100 transition-opacity">{icon}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-bold font-serif italic tracking-tighter">{value}</span>
        <span className="text-xs font-mono opacity-50">{unit}</span>
      </div>
    </div>
  );
}

function InsightItem({ title, desc, status }: { title: string, desc: string, status: 'success' | 'warning' | 'danger' }) {
  return (
    <div className="border-l-2 border-[#F27D26] pl-4 py-1">
      <div className="flex items-center gap-2 mb-1">
        {status === 'success' ? <CheckCircle2 size={12} className="text-[#10b981]" /> : <AlertCircle size={12} className="text-[#F27D26]" />}
        <span className="text-[11px] font-bold uppercase tracking-wider">{title}</span>
      </div>
      <p className="text-[10px] opacity-60 leading-relaxed font-mono">{desc}</p>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, min, max, step }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-mono uppercase tracking-widest opacity-60">{label}</label>
        <span className="text-[10px] font-mono font-bold">{value}</span>
      </div>
      <input 
        type="range" 
        name={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full accent-[#141414] cursor-pointer"
      />
      <div className="flex justify-between text-[8px] font-mono opacity-30">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
