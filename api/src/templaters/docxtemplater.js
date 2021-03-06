var Docxtemplater = require('docxtemplater');
var through2 = require('through2');
var expressions = require('angular-expressions');

var angularParser = function(tag) {
  var expr = expressions.compile(tag);
  return {
    get: expr
  };
};

var log = require('winston').loggers.get('flux-templating');

exports.id = 'docxtemplater';
exports.templateTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
exports.inputTypes = ['application/json'];
exports.outputTypes = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

exports.createStream = function(templateBuffer) {
  var inputBuffers = [];

  return through2(function transform(chunk, enc, callback) {
    inputBuffers.push(chunk);
    callback();
  }, function flush(callback) {
    var input;
    try {
      input = JSON.parse(Buffer.concat(inputBuffers).toString());
    } catch (e) {
      log.warn('Fail to parse input data', e.stack);
      e.statusCode = 400;
      return callback(e);
    }

    var template;
    var result;
    try {
      template = new Docxtemplater(templateBuffer.toString('binary'));
      template.setOptions({
        parser: angularParser
      });
      template.setData(input);
      template.render();
      result = template.getZip().generate({
        type: 'nodebuffer'
      });
    } catch (e) {
      log.warn('Fail to compile or render dox template', e.stack);
      e.statusCode = 400;
      return callback(e);
    }

    this.push(result);
    callback();
  });
};
