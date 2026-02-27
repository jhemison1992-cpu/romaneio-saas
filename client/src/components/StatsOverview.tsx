import React from 'react';

interface StatCard {
  label: string;
  value: number;
  icon: string;
  color: 'teal' | 'sky' | 'emerald' | 'rose';
  bgIcon: string;
  textIcon: string;
  border: string;
  gradient: string;
}

interface StatsOverviewProps {
  stats?: {
    total: number;
    emAndamento: number;
    concluidas: number;
    atrasadas: number;
  };
  loading?: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  stats = {
    total: 14,
    emAndamento: 5,
    concluidas: 8,
    atrasadas: 1,
  },
  loading = false,
}) => {
  const statCards: StatCard[] = [
    {
      label: 'Total de Obras',
      value: stats.total,
      icon: 'ri-building-line',
      color: 'teal',
      bgIcon: 'bg-teal-100',
      textIcon: 'text-teal-600',
      border: 'border-teal-500',
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      label: 'Em Andamento',
      value: stats.emAndamento,
      icon: 'ri-time-line',
      color: 'sky',
      bgIcon: 'bg-sky-100',
      textIcon: 'text-sky-600',
      border: 'border-sky-500',
      gradient: 'from-sky-500 to-sky-600',
    },
    {
      label: 'Concluídas',
      value: stats.concluidas,
      icon: 'ri-checkbox-circle-line',
      color: 'emerald',
      bgIcon: 'bg-emerald-100',
      textIcon: 'text-emerald-600',
      border: 'border-emerald-500',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    {
      label: 'Atrasadas',
      value: stats.atrasadas,
      icon: 'ri-alert-line',
      color: 'rose',
      bgIcon: 'bg-rose-100',
      textIcon: 'text-rose-600',
      border: 'border-rose-500',
      gradient: 'from-rose-500 to-rose-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-4 sm:mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm p-4 sm:p-6 animate-pulse border border-gray-100"
          >
            <div className="h-3 bg-gray-200 rounded-full w-2/3 mb-3 sm:mb-4"></div>
            <div className="h-7 sm:h-8 bg-gray-200 rounded-lg w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Mobile: horizontal scroll cards */}
      <div className="sm:hidden flex gap-2.5 overflow-x-auto no-scrollbar snap-x-mandatory pb-1 mb-4 -mx-3 px-3">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className="stat-card-mobile animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
            <div className={`w-9 h-9 ${card.bgIcon} rounded-xl flex items-center justify-center mb-2.5`}>
              <i className={`${card.icon} text-lg ${card.textIcon}`}></i>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-[11px] font-medium text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Desktop: grid cards */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        {statCards.map((card, idx) => (
          <div
            key={idx}
            className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${card.border} hover:shadow-md transition-all duration-300 border border-gray-100 animate-fade-in`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.bgIcon} rounded-xl flex items-center justify-center`}>
                <i className={`${card.icon} text-2xl ${card.textIcon}`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default StatsOverview;
