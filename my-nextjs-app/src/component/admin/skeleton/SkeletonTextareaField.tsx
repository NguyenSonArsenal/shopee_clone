import {Skeleton} from "antd";

type Props = {
  isLoading: boolean;
  name: string;
  value?: string | number | null;
  placeholder?: string;
  rows?: number;
}

export default function SkeletonTextareaField({isLoading, value, name, placeholder, rows = 3}: Props) {
  return (
    <>
      {isLoading ? (
        <Skeleton active title={false} paragraph={{ rows }} />
      ) : (
        <textarea name={name} placeholder={placeholder} rows={rows} value={value ?? ""}/>
      )}
    </>
  )
}
