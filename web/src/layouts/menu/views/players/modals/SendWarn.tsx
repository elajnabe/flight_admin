import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useSetRecoilState } from 'recoil'
import { locationCustomFilterAtom } from '../../../../../atoms/location'
import { useLocales } from '../../../../../providers/LocaleProvider'

const SendWarn = (props: {id: any }) => {
  const { locale } = useLocales()
  const [reason, setReason] = useState('')
  const setCustomLocationCheckbox = useSetRecoilState(locationCustomFilterAtom)

  return (
    <Stack>
      <TextInput label={"Warn Player"} description={"Set the reason for the player's warning below."} value={reason} onChange={(e) => setReason(e.target.value)} />
      <Button
        uppercase
        disabled={reason === ''}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('flight_admin:warnPlayer', {id: props.id, reason: reason})
        }}
      >
        {locale.ui_confirm}
      </Button>
    </Stack>
  )
}

export default SendWarn
