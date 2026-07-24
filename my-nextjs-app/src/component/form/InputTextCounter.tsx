type InputTextCounterProps = {
  value: string,
  maxLength: number,
}

export default function InputTextCounter({value, maxLength}: InputTextCounterProps) {
  return (
    <div className={`char-counter ${value.length >= maxLength ? 'is-max' : ''}`}>
      {value.length}/{maxLength}
    </div>
  )
}
