export const GENDER = {
	BOY: 1,
	GIRL: 2,
} as const;

export const GENDER_OPTIONS = [
	{ label: 'Nam', value: GENDER.BOY },
	{ label: 'Nữ', value: GENDER.GIRL },
];

export const USER_STATUS = {
	ACTIVE: 1,
	BLOCKED: 2,
} as const;
