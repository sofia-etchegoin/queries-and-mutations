import { useState } from 'react'
import styles from './PokemonListItem.module.css'
import { deletePokemon } from '../apis/pokemon.ts'
import { renamePokemon } from '../apis/pokemon.ts'
import { useMutation } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
interface Props {
  id: number
  name: string
}
export default function PokemonListItem({ id, name }: Props) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(name)

  const queryClient = useQueryClient()

  const deletePokemonMutation = useMutation({
    mutationFn: deletePokemon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon'] })
    },
  })

  const renamePokemonMutation = useMutation({
    mutationFn: renamePokemon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pokemon'] })
    },
  })

  const handleDeleteClick = () => {
    deletePokemonMutation.mutate({ id })
    console.log('deleting', id)
  }

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    renamePokemonMutation.mutate({ id, newName: text })
    setText(text)
    console.log('submitting', text)

    setEditing(false)
  }

  const handleStopEditingClick = () => {
    setEditing(false)
    setText(name)
  }

  const handleStartEditingClick = () => {
    setEditing(true)
  }

  return (
    <div>
      {editing ? (
        <form onSubmit={handleEditSubmit} className={styles.form}>
          <label>Name
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={handleStopEditingClick}>
            Stop Editing
          </button>
        </form>
      ) : (
        <p>
          {id} - {name} -{' '}
          <span className={styles.buttons}>
            <button onClick={handleStartEditingClick}>Rename</button>
            <button onClick={handleDeleteClick}>Delete</button>
          </span>
        </p>
      )}
    </div>
  )
}
