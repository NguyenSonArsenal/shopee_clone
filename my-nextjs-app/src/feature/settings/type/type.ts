type ConfigItem = {
  key: string
  value: unknown
  data_type: "string" | "integer" | "decimal" | "boolean" | "json"
  group: string
  description: string | null
}
