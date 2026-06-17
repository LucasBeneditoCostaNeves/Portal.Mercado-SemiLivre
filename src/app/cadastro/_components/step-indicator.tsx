type StepIndicatorProps = {
  currentStep?: number
  totalSteps?: number
}

export function StepIndicator({ currentStep = 1, totalSteps = 3 }: StepIndicatorProps) {
  return (
    <div className="flex gap-2 mb-10" role="progressbar" aria-valuenow={currentStep} aria-valuemax={totalSteps}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < currentStep ? 'bg-[#FFE600]' : 'bg-zinc-700'
          }`}
        />
      ))}
    </div>
  )
}
