import {memo} from "react";

type InputTextCounterProps = {
  value: string,
  maxLength: number,
}

function InputTextCounter({value, maxLength}: InputTextCounterProps) {
  const length = value ? value.length : 0;
  return (
    <div className={`char-counter ${value?.length >= maxLength ? 'is-max' : ''}`}>
      {`${length}/${maxLength}`}
    </div>
  )
}

export default memo(InputTextCounter);
