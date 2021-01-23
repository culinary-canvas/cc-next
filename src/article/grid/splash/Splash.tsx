import React from 'react'
import s from './Splash.module.scss'

export function Splash() {
  return (
    <article className={s.container}>
      <h1>
        Welcome to
        <br />
        Culinary <span>Canvas</span>
      </h1>
      <p>
        Here you’ll discover insightful profiles on culinary creators from the
        far corners of the globe, learn how their signature dishes came into
        being, and get exclusive step-by-step guides to help you bring their
        creations to life in your own kitchen.
      </p>
    </article>
  )
}
