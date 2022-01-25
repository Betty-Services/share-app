(() => ({
	name: 'PDFViewer',
	icon: 'NavbarIcon',
	category: 'NAVIGATION',
	structure: [
		{
			name: 'PDFViewer',
			options: [
				{
					label: 'PDF (base64 encoded)',
					key: 'pdf',
					value: [''],
					type: 'VARIABLE',
				},
				{
					value: false,
					label: 'Show all pages',
					key: 'showAllPages',
					type: 'TOGGLE',
				},
				{
					value: false,
					label: 'Show pagination',
					key: 'showPagination',
					type: 'TOGGLE',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'showAllPages',
							comparator: 'EQ',
							value: false,
						},
					},
				},
				{
					type: 'VARIABLE',
					label: 'Pagination label (Page x of y)',
					key: 'labelNumberOfPages',
					value: ['Page x of y'],
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'showPagination',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'CUSTOM',
					label: 'Vertical pagination position',
					key: 'verticalPaginationPosition',
					value: 'bottom',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'showPagination',
							comparator: 'EQ',
							value: true,
						},
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Top', value: 'top' },
							{ name: 'Bottom', value: 'bottom' },
						],
					},
				},
				{
					type: 'CUSTOM',
					label: 'Horizontal pagination position',
					key: 'horizontalPaginationPosition',
					value: 'center',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'showPagination',
							comparator: 'EQ',
							value: true,
						},
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Left', value: 'left' },
							{ name: 'Center', value: 'center' },
							{ name: 'Right', value: 'right' },
						],
					},
				},
			],
			descendants: [],
		},
	],
}))();
