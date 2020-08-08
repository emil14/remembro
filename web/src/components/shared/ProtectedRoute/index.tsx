import { useSelector } from 'react-redux'
import React = require('react')
import { Route, RouteProps, Redirect } from 'react-router-dom'
import { RootState } from '../../../store'
import { routes } from '../../../routing'

export function ProtectedRoute({ children, ...rest }: RouteProps) {
  const { data } = useSelector((store: RootState) => store.auth)
  return (
    <Route
      {...rest}
      render={() =>
        data.isAuthethicated ? children : <Redirect to={routes.auth} />
      }
    />
  )
}
