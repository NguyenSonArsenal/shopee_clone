import {Skeleton} from "antd";

type Props = {
  isLoading: boolean;
  value?: string | number | null;
  valueDefault?: string,
  width?: number,
  paragraph?: boolean,
}

export default function SkeletonField({isLoading, value, valueDefault = "-", width = 120, paragraph = false}: Props) {
  return (
    <Skeleton loading={isLoading} active paragraph={paragraph} title={{width: width}}>
      <div>{value ?? valueDefault}</div>
    </Skeleton>
  )
}
