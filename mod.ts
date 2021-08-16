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
const books: Record<string, IBook> = {
  '1': {
    id: '1',
    title: 'The Hound of the Baskervilles',
    author: 'Conan Doyle, Arthur',
  },
}

const router = new Router()
router
  .get('/', context => {
    const titles = map(values(books), (book: IBook) => book.title)
    context.response.body = {
      titles: reduce(titles, (a: string = 'asd', t: string) => `${a}, ${t}`),
      bimps: 'bomps',
    }
  })
  .get('/books', context => {
    context.response.body = values(books)
  })
  .get('/book/:id', context => {
    if (context.params?.id && books[context.params.id]) {
      context.response.body = books[context.params.id]
    }
  })
  .get('/port', ctx => {
    ctx.response.body = { PORT: Deno.env.get('PORT') }
  })

const app = new Application()
app.use(router.routes())
app.use(router.allowedMethods())

addEventListener('fetch', app.fetchEventHandler())
// await app.listen('127.0.0.1:9999')
