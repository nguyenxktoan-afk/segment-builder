import { useState } from 'react';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import type { ConditionGroup, Condition, LogicOperator } from '../../types/segment-builder-types';
import { parsePromptToConditions, simulateAiDelay, AI_SUGGESTION_CHIPS } from '../../data/ai-suggestion-engine';

interface AiSuggestionInputProps {
  onApply: (groups: ConditionGroup[], groupLogic: LogicOperator, name: string) => void;
}

let groupIdCounter = 800;
function newGroupId() { return `ai-grp-${Date.now()}-${++groupIdCounter}`; }

/** Converts flat conditions from the AI engine into a ConditionGroup array */
function conditionsToGroups(conditions: Condition[], logic: LogicOperator): ConditionGroup[] {
  return [{
    id: newGroupId(),
    negated: false,
    logic,
    conditions,
  }];
}

export function AiSuggestionInput({ onApply }: AiSuggestionInputProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<{ count: number; name: string } | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setLastResult(null);

    await simulateAiDelay();

    const result = parsePromptToConditions(prompt);
    const groups = conditionsToGroups(result.conditions, result.logic);

    setLastResult({ count: result.conditions.length, name: result.segmentName });
    setLoading(false);
    onApply(groups, result.logic, result.segmentName);
  };

  const handleChipClick = (chip: string) => {
    setPrompt(chip);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-violet-200/60 rounded-xl p-5">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
          <Sparkles size={14} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">AI Segment Builder</h3>
          <p className="text-xs text-slate-500">Describe your target audience in plain language</p>
        </div>
      </div>

      {/* Input area */}
      <div className="flex gap-2 mb-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "Players who haven&#39;t logged in for 30 days and have spent more than 500k"'
          rows={2}
          className="flex-1 px-3 py-2 rounded-lg border border-violet-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 resize-none placeholder:text-slate-400"
        />
        <button
          onClick={handleGenerate}
          disabled={!prompt.trim() || loading}
          className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:from-violet-700 hover:to-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer self-end shrink-0"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <span className="flex items-center gap-1.5">
              <Wand2 size={14} /> Generate
            </span>
          )}
        </button>
      </div>

      {/* Suggestion chips */}
      <div className="flex flex-wrap gap-1.5 mb-1">
        <span className="text-[10px] text-slate-400 font-medium self-center mr-1">Try:</span>
        {AI_SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            className="px-2 py-0.5 rounded-full text-[11px] text-violet-600 bg-white border border-violet-200 hover:bg-violet-50 hover:border-violet-300 transition-colors cursor-pointer truncate max-w-[260px]"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Result feedback */}
      {lastResult && lastResult.count > 0 && (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
          <Sparkles size={12} />
          Generated {lastResult.count} condition{lastResult.count !== 1 ? 's' : ''} — review and edit below
        </div>
      )}
    </div>
  );
}
