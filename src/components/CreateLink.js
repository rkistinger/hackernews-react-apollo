import React from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { FEED_QUERY } from './LinkList'

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`

export default function CreateLink(props) {
  const [description, setDescription] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [executeMutation] = useMutation(POST_MUTATION, {
    variables: {
      description,
      url,
    },
    // Use update option to update the cache after a mutation has completed.
    // This is especially useful after creating new data (existing data in the cache is updated automatically)
    update: (store, mutationResult) => {
      // get current cached data
      const data = store.readQuery({ query: FEED_QUERY })
      // mutate data
      data.feed.links.unshift(mutationResult.data.post)
      // write back to the cache
      store.writeQuery({
        query: FEED_QUERY,
        data,
      })
    },
  })

  return (
    <div>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="A description for the link"
        />
        <input
          className="mb2"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <button
        onClick={async () => {
          await executeMutation()
          props.history.push('/')
        }}
      >
        Submit
      </button>
    </div>
  )
}
