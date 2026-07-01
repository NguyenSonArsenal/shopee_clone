type DebugPanelProps = {
  data: Record<string, unknown>
}

export default function DebugPanel({ data }: DebugPanelProps) {
  return (
    <pre
      style={{
        position: "fixed",
        bottom: 8,
        right: 8,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        color: "#0f0",
        padding: 12,
        fontSize: 12,
        maxWidth: 320,
        maxHeight: 300,
        overflow: "auto",
        borderRadius: 6,
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  )
}
