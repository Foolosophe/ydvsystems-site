interface SectionHeaderProps {
  tag: string
  title: string
  description?: string
}

export function SectionHeader({ tag, title, description }: SectionHeaderProps) {
  return (
    <div className="text-center mb-14">
      <p className="section-tag">{tag}</p>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-secondary-foreground max-w-xl mx-auto text-lg">
          {description}
        </p>
      )}
    </div>
  )
}
