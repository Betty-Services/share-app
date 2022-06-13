(() => ({
  name: 'Store or redirect page',
  icon: 'UrlInputIcon',
  category: 'CONTENT',
  structure: [
    {
      name: 'StoreOrRedirectPage',
      options: [
        {
          type: 'CUSTOM',
          label: 'Storage location',
          key: 'storage',
          value: 'localStorage',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              {
                name: 'Local Storage',
                value: 'localStorage',
              },
              {
                name: 'Session Storage',
                value: 'sessionStorage',
              },
            ],
          },
        },
        // {
        //   type: 'CUSTOM',
        //   label: 'Storage location',
        //   key: 'storage',
        //   value: 'localStorage',
        //   configuration: {
        //     as: 'DROPDOWN',
        //     dataType: 'string',
        //     allowedInput: [
        //       {
        //         name: 'Local Storage',
        //         value: 'localStorage',
        //       },
        //       {
        //         name: 'Session Storage',
        //         value: 'sessionStorage',
        //       },
        //     ],
        //   },
        // },
        {
          type: 'CUSTOM',
          label: 'Operation',
          key: 'operation',
          value: 'store',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              {
                name: 'Store',
                value: 'store',
              },
              {
                name: 'Redirect',
                value: 'redirect',
              },
            ],
          },
        },
        // {
        //   label: 'Store current page',
        //   key: 'storeCurrentPage',
        //   value: false,
        //   type: 'TOGGLE',
        // },
        // {
        //   label: 'Redirect based on stored/default page',
        //   key: 'redirect',
        //   value: false,
        //   type: 'TOGGLE',
        // },
        {
          value: '',
          label: 'Default page',
          key: 'defaultRedirectPage',
          type: 'ENDPOINT',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'operation',
              comparator: 'EQ',
              value: 'redirect',
            },
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
