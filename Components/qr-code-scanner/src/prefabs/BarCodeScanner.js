(() => ({
  name: 'BarCode Scanner',
  icon: 'ImageInputIcon',
  category: 'FORM',
  keywords: ['Form', 'input', 'image', 'upload', 'camera'],
  structure: [
    {
      name: 'BarCodeScanner',
      options: [
        {
          type: 'SIZE',
          label: 'Image preview width',
          key: 'imagePreviewWidth',
          value: '100%',
          configuration: {
            as: 'UNIT',
          },
        },
        {
          type: 'SIZE',
          label: 'Image preview height',
          key: 'imagePreviewHeight',
          value: '100%',
          configuration: {
            as: 'UNIT',
          },
        },
        {
          type: 'CUSTOM',
          label: 'Facing mode',
          key: 'facingMode',
          value: 'environment',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              { name: 'Environment', value: 'environment' },
              { name: 'User', value: 'user' },
            ],
          },
        },
        {
          value: false,
          label: 'Torch (in development)',
          key: 'torch',
          type: 'TOGGLE',
        },
        {
          value: false,
          label: 'stop Stream',
          key: 'stopStream',
          type: 'TOGGLE',
        },
        {
          type: 'NUMBER',
          label: 'Delay(ms)',
          key: 'delay',
          value: 500,
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
        {
          type: 'VARIABLE',
          label: 'Test attribute',
          key: 'dataComponentAttribute',
          value: ['FileUpload'],
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
