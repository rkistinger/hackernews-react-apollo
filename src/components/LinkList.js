import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import Link from './Link'

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`

export default function LinkList(props) {
  const { loading, error, data } = useQuery(FEED_QUERY)

  if (loading) return <div>Fetching</div>
  if (error) return <div>Error</div>

  const linksToRender = data.feed.links

  return (
    <div>
      {linksToRender.map((link) => (
        <Link key={link.id} link={link} />
      ))}
    </div>
  )
}
