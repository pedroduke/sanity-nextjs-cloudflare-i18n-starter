const chips = [
  { value: 'Global CDN', label: 'Cloudflare Workers' },
  { value: 'Live preview', label: 'Sanity Studio' },
  { value: 'Page builder', label: 'included' },
  { value: 'i18n', label: 'ready' },
]

export const StatChips = () => {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {chips.map(chip => (
        <div
          key={chip.value}
          className="flex items-center gap-2 shrink-0 bg-white border border-gray-200 rounded px-3.5 py-2.5"
        >
          <span className="font-mono text-xs font-semibold text-brand">{chip.value}</span>
          <span className="font-mono text-xs text-gray-700">{chip.label}</span>
        </div>
      ))}
    </div>
  )
}
