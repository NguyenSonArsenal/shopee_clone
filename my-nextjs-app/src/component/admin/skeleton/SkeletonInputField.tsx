import {Skeleton} from "antd";

type Props = {
  isLoading: boolean;
  name: string,
  value?: string | number | null ;
  placeholder?: string,
  size?: 'small' | 'default' | 'large',
  paragraph?: boolean,
  type?: string,
}

export default function SkeletonInputField({isLoading, value, name, placeholder, paragraph = false, type="text", size="large"}: Props) {
  return (
    <>
      {isLoading ? (
        <Skeleton.Input active block size={size} />
      ) : (
        <input type={type} name={name} placeholder={placeholder} value={value ?? ""}/>
      )}
    </>

  )
}
