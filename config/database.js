const path = require('path');

module.exports = ({ env }) => {
  return {
    connection: {
      client: 'better-sqlite3',
      connection: {
        filename: env('DATABASE_FILENAME', path.join(__dirname, '..', '.tmp', 'data.db')),
      },
      useNullAsDefault: true,
    },
  };
};
