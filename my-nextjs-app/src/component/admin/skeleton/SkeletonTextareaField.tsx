import {Skeleton} from "antd";
import {ChangeEventHandler, FocusEventHandler} from "react";

type Props = {
  isLoading: boolean;
  name: string;
  maxLength?: number,
  value?: string | number | null;
  placeholder?: string;
  rows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
}

export default function SkeletonTextareaField({isLoading, value, name, placeholder, rows = 3, onChange, onBlur, maxLength}: Props) {
  return (
    <>
      {isLoading ? (
        <Skeleton active title={false} paragraph={{ rows }} />
      ) : (
        <textarea name={name} placeholder={placeholder} rows={rows} value={value ?? ""} onChange={onChange} onBlur={onBlur} maxLength={maxLength}/>
      )}
    </>
  )
}
