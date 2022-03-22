(() => ({
	name: 'Signature Pad',
	icon: 'FileInputIcon',
	category: 'FORM',
	structure: [
		{
			name: 'SignaturePad',
			options: [
				{
					value: { label: ['Place signature'] },
					label: 'Label',
					key: 'customModelAttribute',
					type: 'CUSTOM_MODEL_ATTRIBUTE',
					configuration: {
						allowedTypes: ['file'],
					},
				},
				{
					value: [],
					label: 'Helper text',
					key: 'helperText',
					type: 'VARIABLE',
				},
				{
					value: '#000000',
					label: 'Pen color',
					key: 'penColor',
					type: 'TEXT',
				},
				{
					value: '',
					label: 'Height',
					key: 'height',
					type: 'NUMBER',
				},
				{
					value: '',
					label: 'Witdh',
					key: 'width',
					type: 'NUMBER',
				},
				{
					value: false,
					label: 'Validation options',
					key: 'validationOptions',
					type: 'TOGGLE',
				},
				{
					value: ['This field is required'],
					label: 'Value required message',
					key: 'validationValueMissing',
					type: 'VARIABLE',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'validationOptions',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					value: false,
					label: 'Styles',
					key: 'styles',
					type: 'TOGGLE',
				},
				{
					value: false,
					label: 'Hide label',
					key: 'hideLabel',
					type: 'TOGGLE',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'styles',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Label color',
					key: 'labelColor',
					value: 'Black',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'styles',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Border color',
					key: 'borderColor',
					value: 'Accent1',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'styles',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Helper color',
					key: 'helperColor',
					value: 'Accent2',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'styles',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					type: 'COLOR',
					label: 'Error color',
					key: 'errorColor',
					value: 'Danger',
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'styles',
							comparator: 'EQ',
							value: true,
						},
					},
				},
				{
					value: false,
					label: 'Advanced settings',
					key: 'advancedSettings',
					type: 'TOGGLE',
				},
				{
					type: 'VARIABLE',
					label: 'name attribute',
					key: 'nameAttribute',
					value: [],
					configuration: {
						condition: {
							type: 'SHOW',
							option: 'advancedSettings',
							comparator: 'EQ',
							value: true,
						},
					},
				},
			],
			descendants: [],
		},
	],
}))();