const server = require('./server');
require('dotenv').config();
server.listen(54024, () =>
  console.log(`listening on port 54024`)
);
