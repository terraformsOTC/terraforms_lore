const TWIN_COLOR = '#d4d4d4';

export default function StatusBadge({ status, category, twin, set, className = '' }) {
  const setBadge = set ? (
    <span
      className={`text-xs px-1 shrink-0 ${className}`}
      style={{ color: set.color, border: `1px solid ${set.color}`, opacity: 0.85 }}
    >
      {set.label}
    </span>
  ) : null;

  const twinBadge = twin ? (
    <span
      className={`text-xs px-1 shrink-0 ${className}`}
      style={{ color: TWIN_COLOR, border: `1px solid ${TWIN_COLOR}`, opacity: 0.7 }}
    >
      twin palette
    </span>
  ) : null;

  if (status === 'unknown') {
    return (
      <div className="flex gap-1 flex-wrap justify-end">
        {setBadge}
        {twinBadge}
        <span className={`text-xs px-1 shrink-0 dim-40 ${className}`} style={{ border: '1px solid var(--border-dim)' }}>
          unidentified
        </span>
      </div>
    );
  }

  if (status === 'llm') {
    return (
      <div className="flex gap-1 flex-wrap justify-end">
        {setBadge}
        {twinBadge}
        <span
          className={`text-xs px-1 shrink-0 ${className}`}
          style={{ color: 'var(--badge-suggestion)', border: '1px solid var(--badge-suggestion-border)' }}
        >
          LLM suggestion
        </span>
      </div>
    );
  }

  if (status === 'uncertain') {
    const catBadge = category && category.label !== 'uncertain' ? (
      <span
        className={`text-xs px-1 shrink-0 ${className}`}
        style={{ color: category.color, border: `1px solid ${category.color}`, opacity: 0.85 }}
      >
        {category.label}
      </span>
    ) : null;
    return (
      <div className="flex gap-1 flex-wrap justify-end">
        {setBadge}
        {twinBadge}
        {catBadge}
        <span
          className={`text-xs px-1 shrink-0 ${className}`}
          style={{ color: 'var(--badge-theory)', border: '1px solid var(--badge-theory-border)' }}
        >
          uncertain
        </span>
      </div>
    );
  }

  if (category) {
    return (
      <div className="flex gap-1 flex-wrap justify-end">
        {setBadge}
        {twinBadge}
        <span
          className={`text-xs px-1 shrink-0 ${className}`}
          style={{ color: category.color, border: `1px solid ${category.color}`, opacity: 0.85 }}
        >
          {category.label}
        </span>
      </div>
    );
  }

  if (setBadge || twinBadge) {
    return <div className="flex gap-1 flex-wrap justify-end">{setBadge}{twinBadge}</div>;
  }
  return null;
}
