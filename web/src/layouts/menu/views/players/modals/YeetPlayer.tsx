import { Button, NumberInput, Stack, Text, TextInput } from '@mantine/core'
import { closeAllModals } from '@mantine/modals'
import { useState } from 'react'
import { useLocales } from '../../../../../providers/LocaleProvider'
import { fetchNui } from '../../../../../utils/fetchNui'

const YeetPlayer = (props: {id: any, type: string}) => {
    const { locale } = useLocales()
    const [reason, setReason] = useState("No Reason")
    const [duration, setDuration] = useState(1)
    console.log(props.type);
    
    return (
        <Stack>
            <Text weight={500}>{props.type == "kick" ? "Kick Player "+props.id : "Ban Player "+props.id}</Text>
            <TextInput value={reason} onChange={(e) => setReason(e.target.value)} />
            
            { props.type == "ban" ?
                <NumberInput noClampOnBlur defaultValue={0.0} label="Duration in Hours (-1 perma)" value={duration} 
                onChange={(value) => value && setDuration(value)} step={0.5} stepHoldDelay={500} 
                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)} />
            : ""}
            <Button
                uppercase
                disabled={duration == 0}
                variant='light'
                color='blue.4'
                onClick={() => {
                    closeAllModals()
                    if (props.type == "ban") {
                        fetchNui('flight_admin:banPlayer', { id: props.id, duration: duration, reason: reason })
                    } else {
                        fetchNui('flight_admin:kickPlayer', { id: props.id, reason: reason })
                    }
                }}
            >{locale.ui_confirm}</Button>
        </Stack>
        )
    }
    
export default YeetPlayer