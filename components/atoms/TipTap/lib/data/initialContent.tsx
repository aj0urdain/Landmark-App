export const initialContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: {
        textAlign: 'left',
        level: 1,
      },
      content: [
        {
          type: 'emoji',
          attrs: {
            name: 'fire',
          },
        },
        {
          type: 'text',
          text: ' Next.js + Tiptap Block Editor Template',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'Welcome to our React Block Editor Template built on top of ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://tiptap.dev/',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'Tiptap',
        },
        {
          type: 'text',
          text: ', ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://nextjs.org/',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'Next.js',
        },
        {
          type: 'text',
          text: ' and ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://tailwindcss.com/',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'Tailwind',
        },
        {
          type: 'text',
          text: '. This project can be a good starting point for your own implementation of a block editor.',
        },
      ],
    },
    {
      type: 'codeBlock',
      attrs: {
        language: null,
      },
      content: [
        {
          type: 'text',
          text: "import { useEditor, EditorContent } from '@tiptap/react'\n\nfunction App() {\n  const editor = useEditor()\n\n  return <EditorContent editor={editor} />\n}",
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'This editor includes features like:',
        },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: 'A DragHandle including a DragHandle menu',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: 'A Slash menu that can be triggered via typing a ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'code',
                    },
                  ],
                  text: '/',
                },
                {
                  type: 'text',
                  text: ' into an empty paragraph or by using the ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  text: '+ Button',
                },
                {
                  type: 'text',
                  text: ' next to the drag handle',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: 'A TextFormatting menu that allows you to change the ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'textStyle',
                      attrs: {
                        fontSize: '18px',
                        fontFamily: null,
                        color: null,
                      },
                    },
                  ],
                  text: 'font size',
                },
                {
                  type: 'text',
                  text: ', ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'bold',
                    },
                  ],
                  text: 'font weight',
                },
                {
                  type: 'text',
                  text: ', ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'textStyle',
                      attrs: {
                        fontSize: null,
                        fontFamily: 'Georgia',
                        color: null,
                      },
                    },
                  ],
                  text: 'font family',
                },
                {
                  type: 'text',
                  text: ', ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'textStyle',
                      attrs: {
                        fontSize: null,
                        fontFamily: null,
                        color: '#b91c1c',
                      },
                    },
                  ],
                  text: 'color',
                },
                {
                  type: 'text',
                  text: ', ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'highlight',
                      attrs: {
                        color: '#7e7922',
                      },
                    },
                  ],
                  text: 'highlight',
                },
                {
                  type: 'text',
                  text: ' and more',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: 'A Table of Contents that can be viewed via clicking on the button on the top left corner',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: 'Live collaboration including content synchronization and collaborative cursors',
                },
              ],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              attrs: {
                class: null,
                textAlign: 'left',
              },
              content: [
                {
                  type: 'text',
                  text: 'AI implementation with text and image generation and auto completion via the ',
                },
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'code',
                    },
                  ],
                  text: 'TAB',
                },
                {
                  type: 'text',
                  text: ' key.',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      type: 'imageBlock',
      attrs: {
        src: '/placeholder-image.jpg',
        width: '100%',
        align: 'center',
      },
    },
    {
      type: 'heading',
      attrs: {
        textAlign: 'left',
        level: 2,
      },
      content: [
        {
          type: 'text',
          text: 'Get started',
        },
      ],
    },
    {
      type: 'paragraph',
      attrs: {
        class: null,
        textAlign: 'left',
      },
      content: [
        {
          type: 'text',
          text: 'To access our block editor template, simply head over to your ',
        },
        {
          type: 'text',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://cloud.tiptap.dev/react-templates',
                target: '_blank',
                class: null,
              },
            },
          ],
          text: 'Tiptap Account',
        },
        {
          type: 'text',
          text: ' If you are not already a member, sign up for an account and complete the 2-minute React Template survey. Once finished, we will send you an invite to the private GitHub repository.',
        },
      ],
    },

    {
      type: 'paragraph',
      attrs: {
        class: null,
        textAlign: 'left',
      },
    },
  ],
};
