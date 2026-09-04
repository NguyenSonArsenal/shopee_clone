export default function TermOfPolicyContent() {
  const content = `
Bala bala ...
Bala bala ...
Bala bala ...
`

  return (
    <div className="whitespace-pre-wrap text-(--text) text-(length:--fs-primary) leading-5" dangerouslySetInnerHTML={{ __html: content }}></div>
  )
}
