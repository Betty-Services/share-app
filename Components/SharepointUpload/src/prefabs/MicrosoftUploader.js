(() => ({
  name: 'MicrosoftUploader',
  icon: 'TitleIcon',
  category: 'CONTENT',
  structure: [
    {
      name: 'MicrosoftUploader',
      options: [
        {
          value: { label: ['Select files(s)...'] },
          label: 'Label',
          key: 'customModelAttribute',
          type: 'CUSTOM_MODEL_ATTRIBUTE',
          configuration: {
            allowedTypes: ['file'],
          },
        },
        {
          type: 'CUSTOM',
          value: 'client',
          key: 'authenticationType',
          label: 'Authentication Type',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              { name: 'Login Popup', value: 'client' },
              { name: 'Access Token via Model', value: 'accessToken' },
              { name: 'Access Token via Action', value: 'action' },
            ],
          },
        },
        {
          type: 'VARIABLE',
          value: [],
          label: 'Client ID',
          key: 'clientId',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'authenticationType',
              comparator: 'EQ',
              value: 'client',
            },
          },
        },
        {
          type: 'VARIABLE',
          value: [],
          label: 'Tenant ID',
          key: 'tenantId',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'authenticationType',
              comparator: 'EQ',
              value: 'client',
            },
          },
        },
        {
          type: 'VARIABLE',
          value: [],
          label: 'Redirect URI',
          key: 'redirectUri',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'authenticationType',
              comparator: 'EQ',
              value: 'client',
            },
          },
        },
        {
          type: 'VARIABLE',
          value: [],
          label: 'Access Token',
          key: 'accessToken',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'authenticationType',
              comparator: 'EQ',
              value: 'accessToken',
            },
          },
        },
        {
          type: 'ACTION',
          value: '',
          label: 'Action UUID',
          key: 'actionId',
          configuration: {
            apiVersion: 'v1',

            condition: {
              type: 'SHOW',
              option: 'authenticationType',
              comparator: 'EQ',
              value: 'action',
            },
          },
        },
        {
          type: 'VARIABLE',
          value: ['/me/drive/root:/'],
          label: 'Root folder',
          key: 'rootFolder',
        },
        {
          type: 'COLOR',
          label: 'Progress color',
          key: 'color',
          value: 'Primary',
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
          label: 'Ready color',
          key: 'readyColor',
          value: 'Success',
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
          label: 'Margin',
          key: 'margin',
          value: 'normal',
          type: 'CUSTOM',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              { name: 'None', value: 'none' },
              { name: 'Dense', value: 'dense' },
              { name: 'Normal', value: 'normal' },
            ],
          },
        },
        {
          type: 'TOGGLE',
          label: 'Full width',
          key: 'fullWidth',
          value: true,
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
          value: false,
          label: 'Advanced settings',
          key: 'advancedSettings',
          type: 'TOGGLE',
        },
        {
          type: 'VARIABLE',
          label: 'Name attribute',
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
          label: 'Id attribute',
          key: 'idAttribute',
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
