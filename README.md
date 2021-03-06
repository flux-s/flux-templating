# Flux templating

[![Build Status](https://travis-ci.org/flux-s/flux-templating.svg)](https://travis-ci.org/flux-s/flux-templating)
[![Coverage Status](https://coveralls.io/repos/flux-s/flux-templating/badge.svg?branch=master&service=github)](https://coveralls.io/github/flux-s/flux-templating?branch=master)

*Transform your data into documents. This project integrates various templating and conversion libraries into a RESTful service.*

## API

Apply a HTML template to JSON data:

    curl -XPOST http://localhost:3111/document?template=hello_world.html -d '{"who":"World"}' -H 'content-type:application/json' -H 'accept:text/html'

Check the same example on the service installed on Amazon ECS:

    curl -XPOST http://ec2-54-213-211-104.us-west-2.compute.amazonaws.com/document?template=hello_world.html -d '{"who":"World"}' -H 'content-type:application/json' -H 'accept:text/html'

Apply the same template but ask for a PDF document as output:

    curl -XPOST http://localhost:3111/document?template=hello_world.html -d '{"who":"World"}' -H 'content-type:application/json' -H 'accept:application/pdf' > hello_world.pdf

Apply a docx template to JSON data:

    curl -XPOST http://localhost:3111/document?template=hello_world.docx -d '{"who":"World"}' -H 'content-type:application/json' -H 'accept:application/vnd.openxmlformats-officedocument.wordprocessingml.document' -o test.docx

## Supported transformations

### HTML to PDF transformation

It uses [html-pdf](https://www.npmjs.com/package/html-pdf) which itself uses [phantomjs](http://phantomjs.org/) a headless Web browser based on webkit. These tasks are delegated to a [phantomjs worker](https://github.com/flux-s/phantomjs-worker).

### Docx and Xlsx to PDF transformation

It uses [unoconv](https://github.com/dagwieers/unoconv) that itself uses [libre office](https://www.libreoffice.org/). These tasks are delegated to a [unoconv worker](https://github.com/flux-s/unoconv-worker).

### Textual and HTML templating

It uses [handlebars](http://handlebarsjs.com/) with a bunch of useful additional helpers from [handlebars-helpers](https://github.com/assemble/handlebars-helpers).

### Docx templating

It uses [docxtemplater](https://github.com/open-xml-templating/docxtemplater) with its optional angular expressions parser.

### Xlsx templating

It uses [xlsx-template](https://github.com/optilude/xlsx-template) and supports filling multiple sheets if an array is passed as JSON input.

## Writing converters and templaters

All type definitions should strictly respect standard mime-types. See the [mime-db](https://github.com/jshttp/mime-db/blob/master/db.json) project for a comprehensive list.

A converter is defined by the input and output types it supports. It defines a createStream(inputType, outputType) method that returns a standard node.js transform stream to be applied to the input data.

A templater is defined by the template type it expects and the input and output types it supports. It defines a createStream(templateBuffer, inputType, outputType) method that returns a standard node.js transform stream to be applied to the input data.

Some templating or conversion libraries have specific system dependancies. They are isolated into small independant worker services, that share the same HTTP API. This API is very similar to the one of flux-templating that acts as orchestrator. There are 3 worker services for now:
  - [phantomjs](https://github.com/flux-s/phantomjs-worker)
  - [unoconv](https://github.com/flux-s/unoconv-worker)
  - [cairo](https://github.com/flux-s/cairo-worker)

## Development environment

Node.js, npm and docker are required.

Install npm dependencies:

    npm install

Build development docker image:

    npm run build

Run the current version of the source (no need to re-build image each time):

    npm start

Test the current version of the source from inside a container (no need to re-build each time):

    npm test

Re-build the image and start the service as if installed for production:

    npm run start-dist

Run the integration test suite from the host machine to the service as if installed for production:

    npm run test-dist
