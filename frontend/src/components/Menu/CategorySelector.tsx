interface CategorySelectorProps {
  categories: { key: string; icon: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
}

export const CategorySelector = ({
  categories,
  selected,
  onSelect,
}: CategorySelectorProps) => (
  <div className="category-selector">
    {categories.map((cat) => (
      <button
        key={cat.key}
        className={selected === cat.key ? "active" : ""}
        onClick={() => onSelect(cat.key)}
      >
        <span>{cat.icon}</span> {cat.label}
      </button>
    ))}
  </div>
);
