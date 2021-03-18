import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // tells appollo we will take care of everything
    read(existing = [], { args, cache }) {
      const { skip, first } = args;

      // read number of items from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      //first thing apollo does is ask the read function for those items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      //if there arent enough items to satisfy how many were requested, and were on the last page, just send it
      if (items.length && items.length !== first && page === pages){
        return items
      }
      if (items.length !== first) {
        return false;
      }
      // we can do 1 of 2 things
      //return items in cache
      if (items.length) {
        return items;
      }

      return false;
      // return false from here, make another network request
    },
    merge(existing, incoming, {args}) {
      const { skip, first } = args
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; ++i){
        merged[i] = incoming[i - skip]
      }

      return merged
    },
  };
}
