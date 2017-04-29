export const config = {
  server_addr: ['192.168.15.134'],
  my_addr: '192.168.15.53',
  prompt: {
            description: ' ',     // Prompt displayed to the user. If not supplied name will be used.
            type: 'string',                 // Specify the type of input to expect.
            hidden: true,                        // If true, characters entered will either not be output to console or will be outputed using the `replace` string.
            replace: '',                        // If `hidden` is set it will replace each hi
          }
}
