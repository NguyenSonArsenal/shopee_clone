import {memo} from "react";

type InputTextCounterProps = {
  value: string,
  maxLength: number,
}

function InputTextCounter({value, maxLength}: InputTextCounterProps) {
  return (
    <div className={`char-counter ${value.length >= maxLength ? 'is-max' : ''}`}>
      {value.length}/{maxLength}
    </div>
  )
}

export default memo(InputTextCounter);
