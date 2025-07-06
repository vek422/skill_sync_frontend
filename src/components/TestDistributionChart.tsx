import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from "recharts";

interface ChartData {
  type: string;
  value: number;
}

interface TestDistributionChartProps {
  data: ChartData[];
}

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={8}
        textAnchor="middle"
        fill="#374151"
        className="font-semibold dark:fill-gray-300"
      >
        {payload.type}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#374151"
        className="text-sm font-medium dark:fill-gray-300"
      >
        {value}
      </text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#6b7280"
        className="text-xs dark:fill-gray-400"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
};

const getColorForType = (type: string): string => {
  switch (type) {
    case "ongoing":
      return "#6366f1"; // Indigo-500 - works in both themes
    case "completed":
      return "#10b981"; // Emerald-500 - works in both themes
    case "scheduled":
      return "#f59e0b"; // Amber-500 - works in both themes
    default:
      return "#8b5cf6"; // Violet-500 - works in both themes
  }
};

export default function TestDistributionChart({
  data,
}: TestDistributionChartProps) {
  const onPieEnter = () => {
    // Handle pie hover if needed
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            onMouseEnter={onPieEnter}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorForType(entry.type)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
