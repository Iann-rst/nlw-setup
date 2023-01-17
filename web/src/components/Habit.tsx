interface HabitProps {
  completed: number;
}

export function Habit({ completed }: HabitProps) {
  return (
    <p>Componente Habit {completed}</p>
  )
}