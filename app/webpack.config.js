const configurator = require('webpack-config');

configurator.environment.setAll({
    env: () => process.env.NODE_ENV || 'base'
});

module.exports = new configurator.default().extend('config/webpack.[env].config.js');
