const http = require('http');
const koa = require('koa');
const KOA_Router = require('koa-router');

var app = new koa();
var router = new KOA_Router();

router.get("/Data", require('/'));
