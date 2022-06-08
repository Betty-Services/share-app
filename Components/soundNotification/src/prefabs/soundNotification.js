(() => ({
  name: 'soundNotification',
  icon: 'ParagraphIcon',
  category: 'CUSTOM',
  structure: [
    {
      name: 'soundNotification',
      options: [        
        {
        type: 'VARIABLE',
        label: 'MP3 url',
        key: 'url',
        value: ['Enter mp3 url...'],
        configuration: {
          as: 'MULTILINE',
        },
      },],
      descendants: [],
    },
  ],
}))();