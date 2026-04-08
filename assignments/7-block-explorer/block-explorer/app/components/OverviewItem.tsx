const Item = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="flex flex-col">
    <span className="text-gray-500">{label}:</span>
    <span className="text-gray-900 dark:text-gray-100">
      {value}
    </span>
  </div>
)

export default Item
