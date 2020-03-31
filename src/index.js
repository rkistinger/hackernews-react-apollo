import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter } from 'react-router-dom'
// import ApolloClient from 'apollo-boost'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import './index.css'
import App from './components/App'
import { AUTH_TOKEN } from './constants'

/*
  Configure the apollo client with the endpoint of our GraphQL server.
  Apollo Boost provides defaults client configuration out of the box (but allows for minimal configuration).
  https://www.apollographql.com/docs/react/get-started/#configuration-options
 */
// const client = new ApolloClient({
//   uri: 'http://localhost:4000',
//   // Set token as header on each request
//   request: (operation) => {
//     const token = localStorage.getItem(AUTH_TOKEN)
//     operation.setContext({
//       headers: {
//         authorization: token ? `Bearer ${token}` : '',
//       },
//     })
//   },
// })

/*
  Apollo Boost is a great way to get started with Apollo Client quickly,
  but there are some advanced features it doesn't support out of the box.

  If you'd like to use subscriptions, swap out the Apollo cache,
  or add an existing Apollo Link to your network stack that isn't already included,
  you will have to set Apollo Client up manually.
*/
const authLink = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  const token = localStorage.getItem(AUTH_TOKEN)

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }))

  return forward(operation)
})

const httpLink = new HttpLink({
  uri: 'http://localhost:4000',
})

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      // Authenticate the websocket connection
      authToken: localStorage.getItem(AUTH_TOKEN),
    },
  },
})

// Using the ability to split links, you can “route” a request to
// a specific middleware link depending on what kind of operation is being sent
const link = split(
  // Test function:
  // If test returns true, the request will be forwarded to the link passed as the second argument.
  // If false, to the third one
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    // Route subscriptions to WS link. Queries & mutations to HTTP link.
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  // Apollo links are middlewares used in the client's networking layer
  link,
  // Recommended default cache
  cache: new InMemoryCache(),
})

/* If necessary, we can execute queries / mutations directly on the client */
// client
//   .query({
//     query: gql`
//       {
//         feed {
//           links {
//             id
//           }
//         }
//       }
//     `,
//   })
//   .then((response) => console.log(response.data.feed))

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)
