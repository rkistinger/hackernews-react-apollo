import React from 'react'
import { gql } from 'apollo-boost'

import Link from './Link'
import { useLazyQuery } from '@apollo/react-hooks'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

const Search = (props) => {
  const [filter, setFilter] = React.useState('')
  // useLazyQuery is not executed until its returned execute function is called
  const [executeQuery, queryResult] = useLazyQuery(FEED_SEARCH_QUERY, {
    variables: {
      filter,
    },
  })

  return (
    <div>
      <div>
        Search
        <input type="text" onChange={(e) => setFilter(e.target.value)} />
        <button onClick={() => executeQuery()}>OK</button>
      </div>
      {(queryResult.data ? queryResult.data.feed.links : []).map(
        (link, index) => (
          <Link key={link.id} link={link} index={index} />
        )
      )}
    </div>
  )
}

export default Search
