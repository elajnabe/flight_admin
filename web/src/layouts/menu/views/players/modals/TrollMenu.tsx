import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Group, Button, Select, NumberInput } from '@mantine/core'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'
const TrollMenu = (props: {id: any}) => {
  const { locale } = useLocales()
  const [duration, setDuration] = useState(0)
  const [actionValue, setActionValue] = useState('')

  return (
    <Stack>
      <Group grow>
        <Select
          label={"Troll Action"}
          placeholder={"Drunk, Animal Attack, Taser..."}
          defaultValue={actionValue}
          value={actionValue}
          onChange={(value) => {
            value && setActionValue(value)
            fetchNui('flight_admin:trollPlayer', {value: value, id: props.id})
          }}
          data={[
            { value: 'animals', label: "Animal Attack" },
            { value: 'taser', label: "Tase" },
            { value: 'drunk', label: "Drunk" },
            { value: 'randomDriving', label: "Random driving" },
            { value: 'fire', label: "Fire" },
            { value: 'switchAnimal', label: "Make animal" },
          ]}
        />
        <NumberInput
          label={"duration"}
          defaultValue={duration}
          value={duration}
          onChange={(value) => {
            value && setDuration(value)
          }}
        />
      </Group>
      <Button
        uppercase
        disabled={duration === 0 || actionValue === null}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('flight_admin:trollPlayer', {id: props.id, value: actionValue, duration: duration})
        }}
      >
        {locale.ui_confirm}
      </Button>
    </Stack>
  )
}

export default TrollMenu
