import { Application, Router } from 'https://deno.land/x/oak/mod.ts'
import {
  map,
  reduce,
  values,
} from 'https://deno.land/x/lodash@4.17.15-es/lodash.js'

interface IBook {
  id: string
  title: string
  author: string
}
const books = new Map<string, IBook>()
books.set('1', {
  id: '1',
  title: 'The Hound of the Baskervilles',
  author: 'Conan Doyle, Arthur',
})

const router = new Router()
router
  .get('/', context => {
    const titles = map(values(books), 'title')
    context.response.body = { titles: reduce(titles, (a, t) => `${a}, ${t}`) }
  })
  .get('/books', context => {
    context.response.body = Array.from(books.values())
  })
  .get('/book/:id', context => {
    if (context.params && context.params.id && books.has(context.params.id)) {
      context.response.body = books.get(context.params.id)
    }
  })
  .get('/port', ctx => {
    ctx.response.body = { PORT: Deno.env.get('PORT') }
  })

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

addEventListener('fetch', app.fetchEventHandler())
