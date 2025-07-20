import React, { useMemo } from "react";
import Tree from "react-d3-tree";

// Recursively converts root_nodes and all subskills to the format react-d3-tree expects
function convertToTreeData(root_nodes: any[]): any[] {
  return root_nodes.map((node) => ({
    name: node.skill,
    attributes: node.priority ? { priority: node.priority } : undefined,
    // Recursively add subskills as children
    children: node.subskills && node.subskills.length > 0 ? convertToTreeData(node.subskills) : undefined,
  }));
}

export interface SkillTreeGraphProps {
  root_nodes: any[];
}

const containerStyles: React.CSSProperties = {
  width: "100%",
  height: "500px",
  background: "#f9fafb",
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  marginTop: 16,
};

const SkillTreeGraph: React.FC<SkillTreeGraphProps> = ({ root_nodes }) => {
  // Wrap all root_nodes under a single root for react-d3-tree
  const data = useMemo(
    () => [
      {
        name: "Skill Graph",
        children: convertToTreeData(root_nodes),
      },
    ],
    [root_nodes]
  );

  if (!root_nodes || root_nodes.length === 0) {
    return <div className="text-center text-muted-foreground">No skill tree data available.</div>;
  }

  return (
    <div style={containerStyles} className="bg-background border border-border rounded-lg">
      <Tree
        data={data}
        orientation="vertical"
        translate={{ x: 350, y: 60 }}
        collapsible={false}
        pathFunc="elbow"
        zoomable={true}
        separation={{ siblings: 2.2, nonSiblings: 2.8 }}
        renderCustomNodeElement={({ nodeDatum }) => (
          <g fontFamily="'Inter', 'Segoe UI', Arial, sans-serif">
            <circle
              r={14}
              fill={nodeDatum.__rd3t.depth === 0 ? '#334155' : '#0ea5e9'}
              stroke="#64748b"
              strokeWidth={nodeDatum.__rd3t.depth === 0 ? 4 : 2}
            />
            <text
              fill="#0f172a"
              fontWeight={nodeDatum.__rd3t.depth === 0 ? 700 : 600}
              fontSize={nodeDatum.__rd3t.depth === 0 ? 18 : 15}
              x={0}
              y={-22}
              textAnchor="middle"
              style={{ pointerEvents: 'none' }}
            >
              {nodeDatum.name}
            </text>
            {nodeDatum.attributes && nodeDatum.attributes.priority && (
              <text x={0} y={-6} fontSize={12} fill="#64748b" textAnchor="middle" style={{ pointerEvents: 'none' }}>
                priority: {nodeDatum.attributes.priority}
              </text>
            )}
          </g>
        )}
        pathClassFunc={() => 'tree-link'}
      />
      <style>{`
        .tree-link {
          stroke: #cbd5e1;
          stroke-width: 2.5px;
        }
        .bg-background {
          background: var(--background, #f9fafb);
        }
        .border-border {
          border-color: var(--border, #e5e7eb);
        }
        @media (prefers-color-scheme: dark) {
          .bg-background {
            background: #1e293b;
          }
          .border-border {
            border-color: #334155;
          }
          .tree-link {
            stroke: #475569;
          }
        }
      `}</style>
    </div>
  );
};

export default SkillTreeGraph;
