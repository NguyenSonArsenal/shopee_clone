import {Controller} from "react-hook-form";
import {useQuery} from "@tanstack/react-query";
import userApi from "@feature/user/userApi";

type Props = {
  control: any;
  name: string;
}

export default function UserSelect({control, name}: Props) {
  const {data: users, isLoading} = useQuery({
    queryKey: ['user-list'],
    queryFn: userApi.getList,
  })

  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <select
          name={field.name}
          value={field.value ?? ""}
          onBlur={field.onBlur}
          onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
          disabled={isLoading}
        >
          <option value="">— Không chọn —</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>{user.full_name}</option>
          ))}
        </select>
      )}
    />
  )
}
