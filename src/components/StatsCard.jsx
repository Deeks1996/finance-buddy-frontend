import CountUp from 'react-countup'; // Import CountUp for animated number counting

const StatsCard = ({
  title,           // Title text shown above the value
  value,           // Numeric or string value to display
  icon,            // Icon element (React node) displayed on left
  borderColor = 'border-blue-800', // Tailwind class for left border color (default)
  iconBg = 'bg-slate-900',         // Tailwind class for icon background color (default)
  iconColor = 'text-slate-600'     // Tailwind class for icon color (default)
}) => {
  return (
    // Main card container with flex layout, padding, margin, background, rounded corners,
    // left border with dynamic color, hover scale effect, transition and cursor pointer
    <div
      className={`flex flex-row items-start sm:items-center gap-4 p-4 mb-6 bg-slate-100 rounded-3xl border-l-4 ${borderColor} hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer`}
    >
      
      {/* Icon Container */}
      <div className={`rounded-full p-3 ${iconBg}`}>
        {/* Icon itself with dynamic text color */}
        <div className={`text-xl ${iconColor}`}>
          {icon}
        </div>
      </div>

      {/* Info section containing title and value */}
      <div className="flex flex-col">
        {/* Title label with smaller, medium-weight text and subtle color */}
        <div className="text-sm text-slate-500 font-medium">{title}</div>

        {/* Value display with larger, bold text */}
        <div className="text-xl font-semibold text-slate-800">
          {/* 
            If value is a number, animate counting up using CountUp component:
            - duration 1.5 seconds
            - Indian numbering separator (comma)
            - 2 decimal places
            - Prefix with currency symbol ₹
          */}
          {typeof value === 'number' ? (
            <CountUp
              end={value}
              duration={1.5}
              separator=","
              decimals={2}
              prefix="₹"
              decimal="."
            />
          ) : (
            // If value is not a number, display it directly (e.g. a string or JSX)
            value
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
