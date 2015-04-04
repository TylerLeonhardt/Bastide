var views = require('co-views');

module.exports = views(__dirname + '/site/templates', {
    map: { html: 'swig' }
});

