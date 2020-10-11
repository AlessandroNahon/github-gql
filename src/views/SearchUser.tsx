import React from 'react'
import { useLazyQuery, gql } from '@apollo/client'

interface Repository {
  name: string
  __typename: string
}

const USER_DATA = gql`
  query($number_of_repos: Int!, $login: String!) {
    user(login: $login) {
      login
      repositories(last: $number_of_repos) {
        nodes {
          name
        }
      }
    }
  }
`

function SearchUser() {
  const [value, setValue] = React.useState('')
  const [getData, { loading, error, data }] = useLazyQuery(USER_DATA)

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  const handleOnSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    getData({ variables: { login: value, number_of_repos: 20 } })
    setValue('')
  }

  const user = data?.user

  return (
    <main>
      <form onSubmit={handleOnSubmit}>
        <input
          type="search"
          name="search"
          aria-label="Search through site content"
          onChange={handleOnChange}
          value={value}
        />
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error</p>
      ) : (
        <section>
          <h2>{user?.login}</h2>
          {user?.repositories?.nodes.map((r: Repository) => (
            <>
              <h3>{r.name}</h3>
            </>
          ))}
        </section>
      )}
    </main>
  )
}

export default SearchUser
