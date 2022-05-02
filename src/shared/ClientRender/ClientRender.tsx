import React, { FunctionComponent, ReactNode } from 'react'
import { useMounted } from '../../services/utils/useMounted'

interface Props {
  children: ReactNode
}

export const ClientRender: FunctionComponent<Props> = ({ children }) => {
  const mounted = useMounted()

  if (!mounted) {
    return null
  }

  return <>{children}</>
}
