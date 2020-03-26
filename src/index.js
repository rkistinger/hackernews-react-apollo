import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './components/App'

// Configure the apollo client with the endpoint of our GraphQL server
// apollo-boost provides defaults client configuration out of the box
// https://www.apollographql.com/docs/react/get-started/#configuration-options
const client = new ApolloClient({
  uri: 'http://localhost:4000',
  // Set token as header on each request
  request: (operation) => {
    const token = localStorage.getItem('token')
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    })
  },
})

// If necessary, we can execute queries / mutations directly on the client
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
