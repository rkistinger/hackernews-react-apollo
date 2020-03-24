import React from 'react'

export default function Link(props) {
  return (
    <div>
      <div>
        {props.link.description} ({props.link.url})
      </div>
    </div>
  )
}
