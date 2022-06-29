(() => ({
  name: 'inlineStyle',
  icon: 'ParagraphIcon',
  category: 'CONTENT',
  keywords: [
    'Content',
    'inlineStyle',
    'type',
    'typography',
    'body',
    'paragraph',
  ],
  structure: [
    {
      name: 'inlineStyle',
      options: [
        {
          type: 'VARIABLE',
          label: 'CSS',
          key: 'css',
          value: [],
          configuration: {
            as: 'MULTILINE',
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
          label: 'Test attribute',
          key: 'dataComponentAttribute',
          value: ['inlineStyle'],
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
