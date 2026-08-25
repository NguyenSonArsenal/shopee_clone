import {Skeleton} from "antd";
import {ChangeEventHandler, FocusEventHandler} from "react";

type Props = {
  isLoading: boolean;
  name: string,
  maxLength?: number,
  value?: string | number | null ;
  placeholder?: string,
  size?: 'small' | 'default' | 'large',
  paragraph?: boolean,
  type?: string,
  onChange?: ChangeEventHandler<HTMLInputElement>,
  onBlur?: FocusEventHandler<HTMLInputElement>
}

export default function SkeletonInputField({isLoading, value, name, placeholder, paragraph = false, type="text", size="large", onChange, onBlur, maxLength }: Props) {
  return (
    <>
      {isLoading ? (
        <Skeleton.Input active block size={size} />
      ) : (
        <input type={type} name={name} placeholder={placeholder} value={value ?? ""} onChange={onChange} onBlur={onBlur} maxLength={maxLength}/>
      )}
    </>

  )
}
