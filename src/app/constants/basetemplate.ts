export const basetemplate = {
  bodyItem: [
    {
      id: 1,
      name: 'table',
      attribute: [
        { prop: 'bgcolor', value: '#FFFFFF' },
        { prop: 'border', value: '0' },
      ],
      styles: [
        { prop: 'border-collapse', value: 'collapse' },
        { prop: 'border', value: '0' },
        { prop: 'border-spacing', value: '0' },
        { prop: 'padding', value: '0' },
      ],
      bodyItem: [
        {
          id: 2,
          name: 'tbody',
          styles: [
            { prop: 'border-collapse', value: 'collapse' },
            { prop: 'border', value: '0' },
            { prop: 'border-spacing', value: '0' },
            { prop: 'padding', value: '0' },
          ],
          bodyItem: [
            {
              id: 3,
              name: 'tr',
              styles: [
                { prop: 'border-collapse', value: 'collapse' },
                { prop: 'border', value: '0' },
                { prop: 'border-spacing', value: '0' },
                { prop: 'padding', value: '0' },
              ],
              bodyItem: [
                {
                  id: 4,
                  name: 'td',
                  styles: [
                    { prop: 'border-collapse', value: 'collapse' },
                    { prop: 'border-spacing', value: '0' },
                    { prop: 'padding', value: '0' },
                  ],
                  bodyItem: [
                    {
                      id: 5,
                      name: 'table',
                      styles: [
                        { prop: 'border-collapse', value: 'collapse' },
                        { prop: 'width', value: '100%' },
                        { prop: 'border-spacing', value: '0' },
                      ],
                      bodyItem: [
                        {
                          id: 6,
                          name: 'tbody',
                          bodyItem: [
                            {
                              id: 7,
                              name: 'tr',
                              styles: [
                                { prop: 'display', value: 'flex' },
                                { prop: 'border-collapse', value: 'collapse' },
                                { prop: 'flex-direction', value: 'row' },
                                { prop: 'padding', value: '0' },
                              ],
                              bodyItem: [
                                {
                                  id: 8,
                                  name: 'td',
                                  styles: [
                                    { prop: 'width', value: '100%' },
                                    { prop: 'display', value: 'flex' },
                                    {
                                      prop: 'border-collapse',
                                      value: 'collapse',
                                    },
                                    { prop: 'display', value: 'flex' },
                                    { prop: 'flex-direction', value: 'column' },
                                    { prop: 'padding', value: '0' },
                                  ],
                                  content: '',
                                  bodyItem: [
                                    {
                                      id: 9,
                                      src: 'https://via.placeholder.com/576x282.png?text=Example Image',
                                      name: 'img',
                                      styles: [
                                        { prop: 'display', value: 'flex' },
                                        {
                                          prop: 'justify-content',
                                          value: 'center',
                                        },
                                        { prop: 'margin-left', value: 'auto' },
                                        { prop: 'margin-right', value: 'auto' },
                                        { prop: 'padding-left', value: '32px' },
                                        {
                                          prop: 'padding-right',
                                          value: '32px',
                                        },
                                        { prop: 'width', value: 'fit-content' },
                                      ],
                                      content: '',
                                      bodyItem: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 10,
                      name: 'table',
                      styles: [
                        { prop: 'border-collapse', value: 'collapse' },
                        { prop: 'width', value: '100%' },
                      ],
                      bodyItem: [
                        {
                          id: 11,
                          name: 'tbody',
                          bodyItem: [
                            {
                              id: 12,
                              name: 'tr',
                              styles: [
                                { prop: 'display', value: 'flex' },
                                { prop: 'border-collapse', value: 'collapse' },
                                { prop: 'flex-direction', value: 'row' },
                                { prop: 'padding', value: '0' },
                              ],
                              bodyItem: [
                                {
                                  id: 13,
                                  name: 'td',
                                  styles: [
                                    { prop: 'width', value: '100%' },
                                    { prop: 'display', value: 'flex' },
                                    {
                                      prop: 'border-collapse',
                                      value: 'collapse',
                                    },
                                    { prop: 'display', value: 'flex' },
                                    { prop: 'flex-direction', value: 'column' },
                                    { prop: 'padding', value: '0' },
                                  ],
                                  content: '',
                                  bodyItem: [
                                    {
                                      id: 14,
                                      name: 'a',
                                      content:
                                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                                      styles: [
                                        { prop: 'margin-right', value: 'auto' },
                                        { prop: 'padding-left', value: '32px' },
                                        { prop: 'padding-right', value: '0px' },
                                      ],
                                      bodyItem: [],
                                    },
                                  ],
                                },
                                {
                                  id: 15,
                                  name: 'td',
                                  styles: [
                                    { prop: 'width', value: '100%' },
                                    { prop: 'display', value: 'flex' },
                                    {
                                      prop: 'border-collapse',
                                      value: 'collapse',
                                    },
                                    { prop: 'display', value: 'flex' },
                                    { prop: 'flex-direction', value: 'column' },
                                    { prop: 'padding', value: '0' },
                                  ],
                                  content: '',
                                  bodyItem: [
                                    {
                                      id: 16,
                                      name: 'a',
                                      content: 'Image Source Text',
                                      styles: [
                                        { prop: 'font-style', value: 'italic' },
                                        { prop: 'display', value: 'flex' },
                                        {
                                          prop: 'justify-content',
                                          value: 'end',
                                        },
                                        { prop: 'margin-left', value: 'auto' },
                                        { prop: 'padding-left', value: '0px' },
                                        {
                                          prop: 'padding-right',
                                          value: '32px',
                                        },
                                      ],
                                      bodyItem: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      id: 17,
                      name: 'table',
                      styles: [
                        { prop: 'border-collapse', value: 'collapse' },
                        { prop: 'width', value: '100%' },
                      ],
                      bodyItem: [
                        {
                          id: 18,
                          name: 'tbody',
                          bodyItem: [
                            {
                              id: 19,
                              name: 'tr',
                              styles: [
                                { prop: 'display', value: 'flex' },
                                { prop: 'border-collapse', value: 'collapse' },
                                { prop: 'flex-direction', value: 'row' },
                                { prop: 'padding', value: '0' },
                              ],
                              bodyItem: [
                                {
                                  id: 20,
                                  name: 'td',
                                  styles: [
                                    { prop: 'width', value: '100%' },
                                    { prop: 'display', value: 'flex' },
                                    {
                                      prop: 'border-collapse',
                                      value: 'collapse',
                                    },
                                    { prop: 'display', value: 'flex' },
                                    { prop: 'flex-direction', value: 'column' },
                                    { prop: 'padding', value: '0' },
                                  ],
                                  content: '',
                                  bodyItem: [
                                    {
                                      id: 21,
                                      name: 'a',
                                      content:
                                        '%#TABLE_OF_CONTENTS#% %#MAIN_NEWS#%',
                                      styles: [
                                        { prop: 'margin-right', value: 'auto' },
                                        { prop: 'padding-left', value: '32px' },
                                        { prop: 'padding-right', value: '0px' },
                                        { prop: 'margin-top', value: '32px' },
                                        { prop: 'margin-bottom', value: '0px' },
                                      ],
                                      bodyItem: [],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
