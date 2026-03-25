import React from 'react'
import { BasicCounter, StepCounter, LimitCounter, Timer } from './Counter'
import Todo, { DarkModeToggle, AutoSaveEditor, MouseTracker } from './Todo'
import List from './List'

const Base = () => {
  return (
    <div>
      {/* <BasicCounter />
      <StepCounter />
      <LimitCounter />
      <Timer /> */}
      <Todo />
      {/* <DarkModeToggle />
      <AutoSaveEditor />
      <MouseTracker />
      <List /> */}
    </div>
  )
}

export default Base