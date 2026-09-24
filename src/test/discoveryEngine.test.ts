import { describe, expect, it } from "vitest";
import { datasets } from "@/data/datasets";
import { buildDegreeMap, pathwaySignal, simulateNodeRemoval } from "@/lib/discoveryEngine";

describe("discovery engine", () => {
  const dataset = datasets[0];

  it("builds deterministic degree counts", () => {
    const degree = buildDegreeMap(dataset.edges);
    expect(degree.get("SNCA")).toBeGreaterThan(0);
  });

  it("removes only edges touching the selected node", () => {
    const result = simulateNodeRemoval(dataset, "SNCA");
    expect(result.removedEdges.length).toBeGreaterThan(0);
    expect(result.remainingEdges.every((edge) => edge.source !== "SNCA" && edge.target !== "SNCA")).toBe(true);
  });

  it("scores pathway overlap without model reasoning", () => {
    const result = pathwaySignal(dataset.pathways[0], dataset.genes);
    expect(result.overlap).toBeGreaterThan(0);
    expect(result.enrichmentStrength).toBeGreaterThan(0);
  });
});
