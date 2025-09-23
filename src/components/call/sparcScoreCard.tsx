export type SparcItem = {
  dim:
    | "growthMindset"
    | "businessThinking"
    | "criticalThinking"
    | "postureCommunication"
    | "aiLiteracy"
    | "techDepth";
  score: number; // 0–10
  rationale?: string; // 1–2 sentences
  evidence?: string[]; // optional short quotes
};

function prettyDim(dim: SparcItem["dim"]) {
  const map: Record<SparcItem["dim"], string> = {
    growthMindset: "Growth Mindset",
    businessThinking: "Business Thinking",
    criticalThinking: "Critical Thinking",
    postureCommunication: "Posture & Communication",
    aiLiteracy: "AI Literacy",
    techDepth: "Technical Depth",
  };

  return map[dim] ?? dim;
}

function pillClass(score: number) {
  // Soft color bands (0–10)
  if (score >= 9) {
    return "bg-green-100 text-green-800 border border-green-200";
  }
  if (score >= 7) {
    return "bg-emerald-50 text-emerald-800 border border-emerald-200";
  }
  if (score >= 5) {
    return "bg-yellow-50 text-yellow-800 border border-yellow-200";
  }
  if (score >= 3) {
    return "bg-orange-50 text-orange-800 border border-orange-200";
  }

  return "bg-red-50 text-red-800 border border-red-200";
}

export function SPARCScoreCard({
  item,
  index,
}: {
  item: SparcItem;
  index: number;
}) {
  return (
    <div className="rounded-2xl bg-white/80 border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700">
            {index + 1}
          </span>
          <h3 className="text-sm font-semibold text-gray-900">
            {prettyDim(item.dim)}
          </h3>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${pillClass(
            item.score
          )}`}
        >
          {item.score}/10
        </span>
      </div>

      {item.rationale && (
        <p className="text-gray-700 text-sm mb-2">{item.rationale}</p>
      )}

      {Array.isArray(item.evidence) && item.evidence.length > 0 && (
        <ul className="mt-2 pl-4 list-disc text-xs text-gray-600 space-y-1">
          {item.evidence.map((e, i) => (
            <li key={i} className="italic">
              “{e}”
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
