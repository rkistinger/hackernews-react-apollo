import React from 'react'
import { gql } from 'apollo-boost'

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { useMutation } from '@apollo/react-hooks'

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
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

export default function Link(props) {
  const authToken = localStorage.getItem(AUTH_TOKEN)
  const [executeMutation] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: props.link.id,
    },
  })

  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={() => executeMutation()}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {props.link.description} ({props.link.url})
        </div>
        <div className="f6 lh-copy gray">
          {props.link.votes.length} votes | by{' '}
          {props.link.postedBy ? props.link.postedBy.name : 'Unknown'}{' '}
          {timeDifferenceForDate(props.link.createdAt)}
        </div>
      </div>
    </div>
  )
}
