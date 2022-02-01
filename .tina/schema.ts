import { defineSchema } from '@tinacms/cli'

export default defineSchema({
  collections: [
    {
      label: 'Page Content',
      name: 'page',
      path: 'content/page',
      fields: [
        {
          name: 'body',
          label: 'Main Content',
          type: 'rich-text',
          isBody: true,
        },
      ],
    },
    {
      label: 'Bookmarks',
      name: 'bookmarks',
      path: 'content/bookmarks',
      fields: [
        {
          type: 'string',
          label: 'Title',
          name: 'title',
        },
        {
          type: 'string',
          label: 'URL',
          name: 'url',
        },
        {
          type: 'string',
          label: 'Key Binding',
          name: 'keyBinding',
        },
      ],
    },
  ],
})
