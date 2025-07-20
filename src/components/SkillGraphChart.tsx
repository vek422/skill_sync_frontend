import React from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";

// Accepts a skillGraph object as prop (nodes: [{label, level}], edges: [])
// For demo, we only visualize the node counts by level
export interface SkillGraphNode {
  id: string;
  label: string;
  level: "easy" | "medium" | "hard";
}

export interface SkillGraphData {
  nodes: SkillGraphNode[];
  // edges?: any[];
}

const COLORS: Record<string, string> = {
  easy: "#22c55e",    // green-500
  medium: "#eab308",  // yellow-500
  hard: "#ef4444",    // red-500
};

export const SkillGraphChart: React.FC<{ skillGraph?: SkillGraphData }> = ({ skillGraph }) => {
  if (!skillGraph || !skillGraph.nodes || skillGraph.nodes.length === 0) {
    return <div className="text-center text-muted-foreground">No skill graph data available.</div>;
  }

  // Count nodes by level
  const data = [
    { level: "Easy", count: skillGraph.nodes.filter(n => n.level === "easy").length },
    { level: "Medium", count: skillGraph.nodes.filter(n => n.level === "medium").length },
    { level: "Hard", count: skillGraph.nodes.filter(n => n.level === "hard").length },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="level" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8">
          {data.map((entry, index) => (
            <rect key={entry.level} fill={COLORS[entry.level.toLowerCase()]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SkillGraphChart;
