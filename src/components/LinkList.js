import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'

import Link from './Link'
import { LINKS_PER_PAGE } from '../constants'

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
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
      count
    }
  }
`

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription NewLinksSubscription {
    newLink {
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
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
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
      user {
        id
      }
    }
  }
`

export default function LinkList(props) {
  const isNewPage = props.location.pathname.includes('new')
  const page = parseInt(props.match.params.page, 10)
  const pageIndex = props.match.params.page ? (page - 1) * LINKS_PER_PAGE : 0
  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
  const first = isNewPage ? LINKS_PER_PAGE : 100
  const orderBy = isNewPage ? 'createdAt_DESC' : null

  const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: {
      skip,
      first,
      orderBy,
    },
  })

  // Update the cached data for this query when a specified subscription fires
  subscribeToMore({
    // Specify the subscription that we want to react to
    document: NEW_LINKS_SUBSCRIPTION,
    // Similar to cache update prop, this function allows you to determine how the store
    // should be updated with the information that was sent by the server after the event occurred.
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev

      const newLink = subscriptionData.data.newLink
      const exists = prev.feed.links.find(({ id }) => id === newLink.id)
      if (exists) return prev

      // Add data returned from subscription to the existing cached data for FEED_QUERY
      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      })
    },
  })

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION,
  })

  if (loading) return <div>Fetching</div>
  if (error) return <div>Error</div>

  const getLinksToRender = () => {
    if (isNewPage) {
      return data.feed.links
    }

    const rankedLinks = data.feed.links.slice()
    rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
    return rankedLinks
  }

  const canGoNext = page <= data.feed.count / LINKS_PER_PAGE
  const canGoPrev = page > 1

  return (
    <div>
      {getLinksToRender().map((link, index) => (
        <Link key={link.id} link={link} index={index + pageIndex} />
      ))}

      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <button
            className="pointer mr2"
            disabled={!canGoPrev}
            onClick={() => {
              props.history.push(`/new/${page - 1}`)
            }}
          >
            Previous
          </button>
          <button
            className="pointer"
            disabled={!canGoNext}
            onClick={() => {
              props.history.push(`/new/${page + 1}`)
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
