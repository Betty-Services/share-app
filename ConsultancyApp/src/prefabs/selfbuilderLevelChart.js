(() => ({
	name: 'SelfbuilderLevelChart',
	icon: 'ContainerIcon',
	category: 'LAYOUT',
	structure: [
		{
			name: 'SelfbuilderLevelChart',
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
					type: 'TEXT',
					label: 'Properties',
					key: 'properties',
					value: '',
					configuration: {
						as: 'MULTILINE',
					},
				},
				{
					type: 'TEXT',
					label: 'Labels',
					key: 'labels',
					value: '',
					configuration: {
						as: 'MULTILINE',
					},
				},
				{
					value: 'bar',
					label: 'Chart Type',
					key: 'chartType',
					type: 'CUSTOM',
					configuration: {
						as: 'DROPDOWN',
						dataType: 'string',
						allowedInput: [
							{ name: 'Pie', value: 'pie' },
							{ name: 'Bar', value: 'bar' },
							{ name: 'Range bar', value: 'rangeBar' },
							{ name: 'Area', value: 'area' },
							{ name: 'Donut', value: 'donut' },
							{ name: 'Line', value: 'line' },
							{ name: 'Candlestick', value: 'candlestick' },
						],
					},
				},
				{
					value: false,
					label: 'Stacked',
					key: 'stacked',
					type: 'TOGGLE',
				},
				{
					type: 'PROPERTY',
					label: 'X-axis property',
					key: 'xAxisProperty',
					value: '',
					configuration: {
						dependsOn: 'model',
						condition: {
							type: 'SHOW',
							option: 'stacked',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'TEXT',
					label: 'Serie labels',
					key: 'serieLabels',
					value: '',
					configuration: {
						as: 'MULTILINE',
						condition: {
							type: 'SHOW',
							option: 'stacked',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'TEXT',
					label: 'Serie properties',
					key: 'serieProperties',
					value: '',
					configuration: {
						as: 'MULTILINE',
						condition: {
							type: 'SHOW',
							option: 'stacked',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'TEXT',
					label: 'Serie colors',
					key: 'serieColors',
					value: '',
					configuration: {
						as: 'MULTILINE',
						condition: {
							type: 'SHOW',
							option: 'stacked',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'VARIABLE',
					label: 'Title',
					key: 'title',
					value: [''],
				},
				{
					type: 'VARIABLE',
					label: 'X-axis title',
					key: 'xAxisTitle',
					value: [''],
				},
				{
					value: false,
					label: 'Hide y-axis',
					key: 'hideYAxis',
					type: 'TOGGLE',
				},
				{
					type: 'VARIABLE',
					label: 'Y-axis title',
					key: 'yAxisTitle',
					value: [''],
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'hideYAxis',
							comparator: 'EQ',
							value: false,
						},
					},
				},
				{
					value: true,
					label: 'Show legend',
					key: 'showLegend',
					type: 'TOGGLE',
				},
				{
					type: 'CUSTOM',
					label: 'Legend position',
					key: 'legendPosition',
					value: 'bottom',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'showLegend',
							comparator: 'EQ',
							value: true,
						},
						as: 'BUTTONGROUP',
						dataType: 'string',
						allowedInput: [
							{ name: 'Top', value: 'top' },
							{ name: 'Right', value: 'right' },
							{ name: 'Bottom', value: 'bottom' },
							{ name: 'Left', value: 'left' },
						],
					},
				},
				{
					value: false,
					label: 'Show Labels',
					key: 'dataLabel',
					type: 'TOGGLE',
				},
				{
					value: true,
					label: 'Show tooltip',
					key: 'showTooltip',
					type: 'TOGGLE',
				},
				{
					value: true,
					label: 'Show grid',
					key: 'showGrid',
					type: 'TOGGLE',
				},
				{
					type: 'COLOR',
					label: 'Color',
					key: 'color',
					value: 'Primary',
				},
				{
					type: 'COLOR',
					label: 'Background color',
					key: 'backgroundColor',
					value: 'White',
				},
				{
					value: '',
					label: 'Height',
					key: 'divHeight',
					type: 'TEXT',
					configuration: {
						as: 'UNIT',
					},
				},
			],
			descendants: [],
		},
	],
}))();
