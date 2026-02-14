'use client';

import { useMemo } from 'react';
import { GitBranchPlus } from 'lucide-react';
import BranchNode from '@/components/BranchNode';

const X_GAP = 220;
const Y_GAP = 92;
const PADDING_X = 34;
const PADDING_Y = 30;

function sortByCreatedAt(a, b) {
  return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
}

function buildLayout(branches) {
  if (!branches.length) return { nodes: [], edges: [], width: 700, height: 280 };

  const childrenByParent = new Map();

  branches.forEach((branch) => {
    const parentKey = branch.parentBranchId ? String(branch.parentBranchId) : '__root__';
    const list = childrenByParent.get(parentKey) || [];
    list.push(branch);
    childrenByParent.set(parentKey, list);
  });

  childrenByParent.forEach((list, key) => {
    const sorted = [...list].sort(sortByCreatedAt);
    childrenByParent.set(key, sorted);
  });

  const rootCandidates = childrenByParent.get('__root__') || [];
  const baselineRoot =
    rootCandidates.find((b) => b.scenario?.type === 'baseline') ||
    [...rootCandidates].sort(sortByCreatedAt)[0];
  const otherRoots = rootCandidates.filter((r) => String(r._id) !== String(baselineRoot?._id));
  const roots = baselineRoot ? [baselineRoot, ...otherRoots] : [...branches].sort(sortByCreatedAt);

  const ordered = [];
  const edges = [];
  const visited = new Set();

  function dfs(branch, depth) {
    const id = String(branch._id);
    if (visited.has(id)) return;
    visited.add(id);

    ordered.push({ ...branch, depth, row: ordered.length });

    const children = childrenByParent.get(id) || [];
    children.forEach((child) => {
      edges.push({ from: id, to: String(child._id) });
      dfs(child, depth + 1);
    });
  }

  roots.forEach((root) => dfs(root, 0));
  branches
    .filter((b) => !visited.has(String(b._id)))
    .sort(sortByCreatedAt)
    .forEach((orphan) => dfs(orphan, 0));

  const nodes = ordered.map((branch) => ({
    ...branch,
    x: PADDING_X + branch.depth * X_GAP,
    y: PADDING_Y + branch.row * Y_GAP
  }));

  const nodeById = new Map(nodes.map((n) => [String(n._id), n]));
  const lineData = edges
    .map((edge) => {
      const from = nodeById.get(edge.from);
      const to = nodeById.get(edge.to);
      if (!from || !to) return null;
      return {
        ...edge,
        x1: from.x + 16,
        y1: from.y + 18,
        x2: to.x - 18,
        y2: to.y + 18
      };
    })
    .filter(Boolean);

  const maxDepth = nodes.reduce((max, n) => Math.max(max, n.depth), 0);
  const width = Math.max(700, PADDING_X * 2 + maxDepth * X_GAP + 340);
  const height = Math.max(280, PADDING_Y * 2 + Math.max(0, nodes.length - 1) * Y_GAP + 80);

  return { nodes, edges: lineData, width, height };
}

export default function BranchTree({
  branches = [],
  selectedBranchId,
  onSelectBranch,
  onCreateBranch
}) {
  const { nodes, edges, width, height } = useMemo(() => buildLayout(branches), [branches]);
  const selectedId = selectedBranchId ? String(selectedBranchId) : String(nodes[0]?._id || '');

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="panel-title">Branch Graph</p>
          <p className="mt-1 text-xs text-slate-500">Main branch spine with scenario branches fanning right</p>
        </div>
        <button
          onClick={() => selectedId && onCreateBranch?.(selectedId)}
          disabled={!selectedId}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <GitBranchPlus size={14} />
          Create Branch
        </button>
      </div>

      <div className="relative max-h-[560px] overflow-x-auto overflow-y-auto rounded-2xl border border-blue-100/70 bg-gradient-to-br from-slate-50 via-white to-blue-50/60">
        <div
          className="relative min-h-[280px] min-w-full"
          style={{
            width,
            height,
            backgroundImage:
              'linear-gradient(to right, rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.08) 1px, transparent 1px)',
            backgroundSize: '38px 38px'
          }}
        >
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            {edges.map((edge) => {
              const midX = edge.x1 + (edge.x2 - edge.x1) * 0.4;
              const d = `M ${edge.x1} ${edge.y1} C ${midX} ${edge.y1}, ${midX} ${edge.y2}, ${edge.x2} ${edge.y2}`;
              return (
                <path
                  key={`${edge.from}-${edge.to}`}
                  d={d}
                  fill="none"
                  stroke="rgba(37, 99, 235, 0.28)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          {nodes.map((node) => (
            <BranchNode
              key={String(node._id)}
              branch={node}
              isSelected={String(node._id) === selectedId}
              onSelect={() => onSelectBranch?.(String(node._id))}
              onCreateBranch={() => onCreateBranch?.(String(node._id))}
              x={node.x}
              y={node.y}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
