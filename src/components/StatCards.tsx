import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react";

const StatCards = () => {
  const stats = [
    {
      title: "Total Applications",
      value: 24,
      icon: Briefcase,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-400/20",
      textColor: "text-white",
    },
    {
      title: "Pending Applications",
      value: 12,
      icon: Clock,
      bgColor: "bg-gradient-to-br from-amber-500 to-orange-500",
      iconBg: "bg-orange-400/20",
      textColor: "text-white",
    },
    {
      title: "Failed Applications",
      value: 8,
      icon: XCircle,
      bgColor: "bg-gradient-to-br from-red-500 to-red-600",
      iconBg: "bg-red-400/20",
      textColor: "text-white",
    },
    {
      title: "Successful Applications",
      value: 4,
      icon: CheckCircle,
      bgColor: "bg-gradient-to-br from-emerald-500 to-green-600",
      iconBg: "bg-green-400/20",
      textColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3
                  className={`${stat.textColor} text-sm font-medium opacity-90 mb-2`}
                >
                  {stat.title}
                </h3>
                <p className={`${stat.textColor} text-3xl font-bold mb-1`}>
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                <Icon className={`${stat.textColor} w-6 h-6`} />
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <div className={`${stat.textColor} text-xs opacity-75`}>
                {index === 0 && "↗ +2 this week"}
                {index === 1 && "⏱ In review"}
                {index === 2 && "↘ -1 this week"}
                {index === 3 && "🎉 New offers"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatCards;
