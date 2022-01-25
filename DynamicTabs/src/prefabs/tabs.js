(() => ({
	name: 'DynamicTabs',
	icon: 'TabsIcon',
	category: 'NAVIGATION',
	keywords: ['Navigation', 'tabs'],
	structure: [
		{
			name: 'DynamicTabs',
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
					label: 'Tab label property',
					key: 'labelProperty',
					value: '',
					type: 'PROPERTY',
					configuration: {
						dependsOn: 'model',
					},
				},
				{
					label: 'Tab icon property',
					key: 'iconProperty',
					value: '',
					type: 'PROPERTY',
					configuration: {
						dependsOn: 'model',
					},
				},
				{
					label: 'Icon Alignment',
					key: 'iconAlignment',
					value: 'top',
					type: 'CUSTOM',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Left', value: 'left' },
							{ name: 'Top', value: 'top' },
							{ name: 'Right', value: 'right' },
							{ name: 'Bottom', value: 'bottom' },
						],
						condition: {
							type: 'HIDE',
							option: 'icon',
							comparator: 'EQ',
							value: 'None',
						},
					},
				},
				{
					type: 'TOGGLE',
					label: 'Disable ripple',
					key: 'disableRipple',
					value: false,
				},
				{
					label: 'Selected tab index',
					key: 'defaultValue',
					value: '1',
					type: 'NUMBER',
				},
				{
					type: 'SIZE',
					label: 'Height',
					key: 'height',
					value: '',
					configuration: {
						as: 'UNIT',
					},
				},
				{
					type: 'SIZE',
					label: 'Width',
					key: 'width',
					value: '',
					configuration: {
						as: 'UNIT',
					},
				},
				{
					value: 'top',
					label: 'Alignment',
					key: 'alignment',
					type: 'CUSTOM',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Left', value: 'left' },
							{ name: 'Top', value: 'top' },
							{ name: 'Right', value: 'right' },
							{ name: 'Bottom', value: 'bottom' },
						],
					},
				},
				{
					label: 'Variant',
					key: 'variant',
					value: 'standard',
					type: 'CUSTOM',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Standard', value: 'standard' },
							{ name: 'Scrollable', value: 'scrollable' },
							{ name: 'Full width', value: 'fullWidth' },
						],
					},
				},
				{
					label: 'Scrollbuttons',
					key: 'scrollButtons',
					value: 'auto',
					type: 'CUSTOM',
					configuration: {
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Auto', value: 'auto' },
							{ name: 'Desktop', value: 'desktop' },
							{ name: 'Always', value: 'on' },
							{ name: 'Never', value: 'off' },
						],
						condition: {
							type: 'SHOW',
							option: 'variant',
							comparator: 'EQ',
							value: 'scrollable',
						},
					},
				},
				{
					type: 'TOGGLE',
					label: 'Centered',
					key: 'centered',
					value: false,
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'orientation',
							comparator: 'EQ',
							value: 'horizontal',
						},
					},
				},
				{
					label: 'Bar color',
					key: 'appBarColor',
					value: 'Primary',
					type: 'COLOR',
				},
				{
					label: 'Text color',
					key: 'textColor',
					value: 'White',
					type: 'COLOR',
				},
				{
					label: 'Indicator color',
					key: 'indicatorColor',
					value: 'Success',
					type: 'COLOR',
				},
			],
			descendants: [],
		},
	],
}))();
