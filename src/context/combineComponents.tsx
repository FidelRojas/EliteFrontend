/* eslint-disable react/display-name */
import React from "react"
import { FC } from "react"

export const combineComponents = (...components: FC[]) => {
  return components.reduce(
    (AccumulatedComponents, CurrentComponent: FC<any>) => {
      return ({ children }): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        )
      }
    },
    ({ children }: any) => <>{children}</>,
  )
}
