import { useState } from 'react'
import { closeAllModals } from '@mantine/modals'
import { Stack, Button, TextInput } from '@mantine/core'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'

const SendAnnouncement: React.FC = () => {
  const { locale } = useLocales()
  const [message, setMessage] = useState('')

  return (
    <Stack>
      <TextInput label={locale.ui_announcement_name} description={locale.ui_announcement_description} value={message} onChange={(e) => setMessage(e.target.value)} />
      <Button
        uppercase
        disabled={message === ''}
        variant='light'
        color='blue.4'
        onClick={() => {
          closeAllModals()
          fetchNui('flight_admin:Announce', message)
        }}
      >
        {locale.ui_confirm}
      </Button>
    </Stack>
  )
}

export default SendAnnouncement
