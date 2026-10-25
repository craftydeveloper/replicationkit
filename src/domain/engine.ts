export interface RunSnapshot { runId: string; outputs: Record<string,string>; metrics: Record<string,number> }
export interface RunComparison { equivalent: boolean; changedOutputs: string[]; metricDeltas: Array<{name:string;delta:number}> }
export function compareRuns(baseline: RunSnapshot, current: RunSnapshot, tolerance = 1e-8): RunComparison {
  if (!Number.isFinite(tolerance) || tolerance < 0) throw new RangeError("tolerance must be a non-negative number");
  const outputKeys = [...new Set([...Object.keys(baseline.outputs), ...Object.keys(current.outputs)])].sort();
  const changedOutputs = outputKeys.filter(key => baseline.outputs[key] !== current.outputs[key]);
  const metricKeys = [...new Set([...Object.keys(baseline.metrics), ...Object.keys(current.metrics)])].sort();
  const metricDeltas: Array<{name:string;delta:number}> = [];
  for (const name of metricKeys) {
    const left = baseline.metrics[name]; const right = current.metrics[name];
    if (left === undefined || right === undefined || Math.abs(left-right) > tolerance) metricDeltas.push({name,delta:left === undefined || right === undefined ? Number.POSITIVE_INFINITY : right-left});
  }
  return { equivalent: changedOutputs.length === 0 && metricDeltas.length === 0, changedOutputs, metricDeltas };
}