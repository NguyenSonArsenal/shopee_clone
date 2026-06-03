// src/components/FormErrors.tsx
interface Props {
	error: string[];
}

export default function FormErrors({ error }: Props) {
	if (error.length === 0) return null;

	return (
		<div className="mb-4 rounded-sm bg-red-50 border border-red-200 p-3 text-xs text-red-600">
			<ul className="list-disc list-inside space-y-1">
				{error.map((err, index) => (
					<li key={index}>{err}</li>
				))}
			</ul>
		</div>
	);
}
