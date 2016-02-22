var getBabelRelayPlugin = require('babel-relay-plugin');

var schemaData = require('../data/schema.json').data;

var plugin = getBabelRelayPlugin(schemaData);

module.exports = plugin;
