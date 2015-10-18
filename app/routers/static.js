var Path = require('path');

module.exports = {
  directory: {
    path: Path.join(__dirname, '../node_modules/flux-utils-todomvc'),
    redirectToSlash: true,
    index: true
  }
};