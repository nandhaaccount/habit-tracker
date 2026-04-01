import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [habits, setHabits] = useState([])
  const [newHabit, setNewHabit] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHabits()
  }, [])

  async function fetchHabits() {
    setLoading(true)
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) console.error(error)
    else setHabits(data)
    setLoading(false)
  }

  async function addHabit() {
    if (!newHabit.trim()) return
    const { error } = await supabase
      .from('habits')
      .insert([{ name: newHabit, is_done: false }])
    if (error) console.error(error)
    else {
      setNewHabit('')
      fetchHabits()
    }
  }

  async function toggleHabit(id, currentStatus) {
    const { error } = await supabase
      .from('habits')
      .update({ is_done: !currentStatus })
      .eq('id', id)
    if (error) console.error(error)
    else fetchHabits()
  }

  async function deleteHabit(id) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
    if (error) console.error(error)
    else fetchHabits()
  }

  return (
    <div className="container">
      <h1>🌟 Daily Habit Tracker</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Add a new habit..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addHabit()}
        />
        <button onClick={addHabit}>Add</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : habits.length === 0 ? (
        <p>No habits yet. Add one above!</p>
      ) : (
        <ul>
          {habits.map((habit) => (
            <li key={habit.id} className={habit.is_done ? 'done' : ''}>
              <span onClick={() => toggleHabit(habit.id, habit.is_done)}>
                {habit.is_done ? '✅' : '⬜'} {habit.name}
              </span>
              <button className="delete" onClick={() => deleteHabit(habit.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}

      <p className="summary">
        {habits.filter(h => h.is_done).length} of {habits.length} completed
      </p>
    </div>
  )
}

export default App