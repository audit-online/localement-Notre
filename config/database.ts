export default ({ env }) => {
  return {
    connection: {
      client: 'sqlite',
      connection: {
        filename: ':memory:',
      },
      useNullAsDefault: true,
    },
  };
};
