import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}: SearchInputProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search
        size={18}
        strokeWidth={2}
        className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--muted)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          paddingLeft: '3.5rem',
          paddingRight: '1.25rem',
          paddingTop: '0.875rem',
          paddingBottom: '0.875rem',
          borderRadius: '9999px',
          background: 'var(--card)',
          boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.05)',
        }}
      />
    </div>
  );
}
