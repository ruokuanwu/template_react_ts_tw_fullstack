import { queryOptions } from '@tanstack/react-query'
import { getHello } from './api'

export const helloQueryOptions = queryOptions({
  queryKey: ['hello'],
  queryFn: ({ signal }) => getHello({ signal }),
})
