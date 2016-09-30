'use strict';
const Router = require('koa-router')
import Cors from 'koa-cors'
import pug from 'pug'
import path from 'path'

const router = new Router({
  prefix: '/w'
})

router.use(Cors({
  origin: true,
  maxAge: 60 * 60 * 24,
  credentials: true,
  methods: ['GET']
}))

router.get('/mdocswidgets', function* () {
  this.type = 'application/javascript; charset=utf-8';
  this.body = `
    console.log('widgets script');
  `;
})

router.get('/c', function* () {
  this.body = `Click action for id ${Object.keys(this.request.query).join('-')}`;
})

router.get('sample', '/', function* () {
  const {id = 123, width = '140x60' } = this.request.query
  this.render('widgets/sample', Object.assign({}, this.jadeLocals, {
    id,width
  }), true);
})

router.get('generate', '/generate', function* () {
  const {id = 123, width = '140x60' } = this.request.query

  const locals = Object.assign({}, this.jadeLocals, {id, width})
  const widget = pug.renderFile(path.join(__dirname, '../../../views/widgets/generator.pug'), locals)
  this.render('widgets/generate', Object.assign({}, locals, {widget}), true)
})


module.exports = router
