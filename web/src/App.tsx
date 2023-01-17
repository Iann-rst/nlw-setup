import './styles/global.css';

import { Habit } from "./components/Habit"

function App() {
  return (
    <div>
      <Habit completed={2} />
      <Habit completed={11} />
      <Habit completed={23} />
    </div>
  )
}

export default App
