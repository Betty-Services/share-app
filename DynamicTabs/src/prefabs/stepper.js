(() => ({
	name: 'DynamicStepper',
	icon: 'StepperIcon',
	category: 'NAVIGATION',
	keywords: ['Navigation', 'stepper', 'progress'],
	structure: [
		{
			name: 'DynamicStepper',
			options: [
				{
					value: '',
					label: 'Model',
					key: 'model',
					type: 'MODEL',
				},
				{
					value: {},
					label: 'Filter',
					key: 'filter',
					type: 'FILTER',
					configuration: {
						dependsOn: 'model',
					},
				},
				{
					type: 'PROPERTY',
					label: 'Order by',
					key: 'orderBy',
					value: '',
					configuration: {
						dependsOn: 'model',
					},
				},
				{
					type: 'CUSTOM',
					label: 'Sort order',
					key: 'order',
					value: 'asc',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						condition: {
							type: 'HIDE',
							option: 'orderBy',
							comparator: 'EQ',
							value: '',
						},
						allowedInput: [
							{ name: 'Ascending', value: 'asc' },
							{ name: 'Descending', value: 'desc' },
						],
					},
				},
				{
					label: 'Step label property',
					key: 'labelProperty',
					value: '',
					type: 'PROPERTY',
					configuration: {
						dependsOn: 'model',
					},
				},
				{
					label: 'Step icon property',
					key: 'iconProperty',
					value: '',
					type: 'PROPERTY',
					configuration: {
						dependsOn: 'model',
					},
				},
				{
					type: 'CUSTOM',
					label: 'Type',
					key: 'type',
					value: 'horizontal',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Horizontal', value: 'horizontal' },
							{ name: 'Vertical', value: 'vertical' },
							{ name: 'Mobile', value: 'mobile' },
						],
					},
				},
				{
					type: 'CUSTOM',
					label: 'Variant',
					key: 'variant',
					value: 'non-linear',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Linear', value: 'linear' },
							{ name: 'Non-linear', value: 'non-linear' },
						],
						condition: {
							type: 'HIDE',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'TOGGLE',
					label: 'Alternative label',
					key: 'alternativeLabel',
					value: false,
					configuration: {
						condition: {
							type: 'HIDE',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Active color',
					key: 'activeColor',
					value: 'Primary',
				},
				{
					type: 'COLOR',
					label: 'Active Label color',
					key: 'activeLabelColor',
					value: 'Black',
					configuration: {
						condition: {
							type: 'HIDE',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Inactive color',
					key: 'inactiveColor',
					value: 'Secondary',
				},
				{
					type: 'COLOR',
					label: 'Inactive Label color',
					key: 'inactiveLabelColor',
					value: 'Medium',
					configuration: {
						condition: {
							type: 'HIDE',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Background color',
					key: 'backgroundColor',
					value: 'White',
				},
				{
					type: 'COLOR',
					label: 'Connector color',
					key: 'connectorColor',
					value: 'Light',
					configuration: {
						condition: {
							type: 'HIDE',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Step Progress color',
					key: 'stepProgressColor',
					value: 'Black',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'VARIABLE',
					label: 'Button next text',
					key: 'buttonNext',
					value: ['Next'],
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
				{
					type: 'VARIABLE',
					label: 'Button previous text',
					key: 'buttonPrev',
					value: ['Back'],
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'type',
							comparator: 'EQ',
							value: 'mobile',
						},
					},
				},
			],
			descendants: [],
		},
	],
}))();
