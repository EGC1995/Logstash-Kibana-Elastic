'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getElasticsearchProxyConfig = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _fs = require('fs');

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = file => (0, _fs.readFileSync)(file, 'utf8');

const createAgent = server => {
  const config = server.config();
  const target = _url2.default.parse(config.get('elasticsearch.url'));

  if (!/^https/.test(target.protocol)) return new _http2.default.Agent();

  const agentOptions = {};

  const verificationMode = config.get('elasticsearch.ssl.verificationMode');
  switch (verificationMode) {
    case 'none':
      agentOptions.rejectUnauthorized = false;
      break;
    case 'certificate':
      agentOptions.rejectUnauthorized = true;

      // by default, NodeJS is checking the server identify
      agentOptions.checkServerIdentity = _lodash2.default.noop;
      break;
    case 'full':
      agentOptions.rejectUnauthorized = true;
      break;
    default:
      throw new Error(`Unknown ssl verificationMode: ${verificationMode}`);
  }

  if (_lodash2.default.size(config.get('elasticsearch.ssl.certificateAuthorities'))) {
    agentOptions.ca = config.get('elasticsearch.ssl.certificateAuthorities').map(readFile);
  }

  // Add client certificate and key if required by elasticsearch
  if (config.get('elasticsearch.ssl.certificate') && config.get('elasticsearch.ssl.key')) {
    agentOptions.cert = readFile(config.get('elasticsearch.ssl.certificate'));
    agentOptions.key = readFile(config.get('elasticsearch.ssl.key'));
    agentOptions.passphrase = config.get('elasticsearch.ssl.keyPassphrase');
  }

  return new _https2.default.Agent(agentOptions);
};

const getElasticsearchProxyConfig = exports.getElasticsearchProxyConfig = server => {
  return {
    timeout: server.config().get('elasticsearch.requestTimeout'),
    agent: createAgent(server)
  };
};
