export function FlagMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 30 21" aria-hidden="true" className="flagmark">
      <rect width="10" height="21" fill="#008751" /><rect x="10" width="10" height="21" fill="#fff" /><rect x="20" width="10" height="21" fill="#008751" />
    </svg>
  );
}
