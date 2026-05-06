interface StarRatingProps {
  correct: number
  total: number
}

export function StarRating({ correct, total }: StarRatingProps) {
  const ratio = correct / total
  const stars = ratio >= 0.875 ? 3 : ratio >= 0.625 ? 2 : ratio >= 0.375 ? 1 : 0

  return (
    <div className="flex gap-1 justify-center" aria-label={`${stars} out of 3 stars`}>
      {[1, 2, 3].map(s => (
        <span key={s} className={`text-4xl ${s <= stars ? '' : 'opacity-20'}`}>
          ⭐
        </span>
      ))}
    </div>
  )
}
