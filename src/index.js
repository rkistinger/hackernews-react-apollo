import React from 'react'
import ReactDOM from 'react-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

import './index.css'
import App from './components/App'

// Configure the apollo client with the endpoint of our GraphQL server
const client = new ApolloClient({
  uri: 'http://localhost:4000',
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
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
