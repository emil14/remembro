import * as React from 'react'
import css from './index.css'

export class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div className={css.sww}>Oops! Something went wrong</div>
    }
    return this.props.children
  }
}
