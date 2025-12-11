import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Completed", value: 34 },
  { name: "Pending", value: 22 },
  { name: "In Review", value: 10 },
];

const COLORS = ["#b26bff", "#ff6ac1", "#6bc4ff"];

const StatusChart = () => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl shadow-lg w-full md:w-1/3 mb-6">
      <h3 className="text-lg font-semibold">IP Status Overview</h3>

      <div className="h-40 mt-4">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-around text-xs mt-3">
        {data.map((d, i) => (
          <div key={i}>
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ background: COLORS[i] }}
            />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusChart;
