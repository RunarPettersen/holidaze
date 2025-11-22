export type TabItem<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
};

export default function TabBar<T extends string>({ items, value, onChange }: Props<T>) {
  return (
    <div className="inline-flex rounded-lg border bg-gray-50 text-sm overflow-hidden">
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            type="button"
            onClick={() => onChange(it.value)}
            className={"px-3 py-1" + (active ? " bg-white text-brand" : " text-gray-600 hover:bg-gray-100")}
          >
            {it.label}
          </button>
        );
      })}
    </div>
  );
}