import React from 'react'
import { useRouteError } from 'react-router-dom'

const ErrorPage = ({ noSuchPage }) => {
    const err = useRouteError()

    return (
        <div>
            <h1>An error occured</h1>
            {noSuchPage === true && <p>404 no such page found</p>}
            {err?.data !== '' && <p>{err.data}</p>}
            {err?.message?.toLowerCase() === 'network error' && <p>Network error occured try again</p>}
        </div>
    )
}

export default ErrorPage
