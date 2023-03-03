import { Text, Stack, SimpleGrid, Button, Paper, Group, Space } from '@mantine/core'
import { openModal } from '@mantine/modals'
import { useEffect, useState } from 'react'
import { FiFastForward } from 'react-icons/fi'
import { getInteriorData } from '../../../../atoms/interior'
import { getLastLocation } from '../../../../atoms/location'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { fetchNui } from '../../../../utils/fetchNui'
import CreateLocation from '../locations/components/modals/CreateLocation'
import SendAnnouncement from './modals/SendAnnouncement'
import { setClipboard } from '../../../../utils/setClipboard'
import SetCoords from './modals/SetCoords'
import { useRecoilState } from 'recoil'
import { positionAtom } from '../../../../atoms/position'
import { worldFreezeTimeAtom } from '../../../../atoms/world'
import { useLocales } from '../../../../providers/LocaleProvider'
import { FaMapMarkerAlt } from 'react-icons/fa'
import {BsFillInfoCircleFill, BsFillPinMapFill} from 'react-icons/bs'
import KickAll from './modals/KickAll'
import WarnAll from './modals/WarnAll'

const Home: React.FC = () => {
  const { locale } = useLocales()
  const lastLocation = getLastLocation()
  const interior = getInteriorData()
  const [currentCoords, setCurrentCoords] = useRecoilState(positionAtom)
  const [currentPlayers, setCurrentPlayers] = useState(0)
  const [currentUpTime, setCurrentUpTime] = useState(0)
  const [currentNextRestart, setNextRestart] = useState(0)
  const [currentHeading, setCurrentHeading] = useState('0.000')
  const [timeFrozen, setTimeFrozen] = useRecoilState(worldFreezeTimeAtom)
  const [copiedCoords, setCopiedCoords] = useState(false)
  const [noclipActive, setNoclip] = useState(false)

  useNuiEvent('playerCoords', (data: { coords: string, heading: string }) => {
    setCurrentCoords(data.coords)
    setCurrentHeading(data.heading)
  })

  useNuiEvent('serverInfo', (data: { players: number, uptime:number, nextRestart:number}) => {
    setCurrentPlayers(data.players)
    setCurrentUpTime(data.uptime)
    setNextRestart(data.nextRestart)
  })

  // Copied coords button
  useEffect(() => {
    setTimeout(() => {
      if (copiedCoords) setCopiedCoords(false)
    }, 1000)
  }, [copiedCoords, setCopiedCoords])

  return (
    <SimpleGrid cols={1}>
      <Stack>

        {/* CURRENT COORDS */}
        <Paper p='md'>
          
          <Group position='apart'>
            <Text size={20} weight={600}>{locale.ui_general_tab}</Text>
            <BsFillInfoCircleFill size={24}/>
          </Group>
          
          <Space h='sm' />

          <Group position='apart'>
            <Group><Text>{locale.ui_players}:</Text><Text color='blue.4' >{currentPlayers}</Text></Group>
            <Group><Text>{locale.ui_uptime}:</Text><Text color='blue.4'  >{0}</Text></Group>
            <Group><Text>{locale.ui_schedRestart}:</Text><Text color='blue.4' style={{ minWidth: '15px' }} >{0}</Text></Group>
          </Group>
          
          <Space h='sm' />

          <Group grow>
          <Button
              color='green.7'
              variant='light'
              size='xs'
              onClick={() =>
                openModal({
                  title: locale.ui_announcement_title,
                  size: 'lg',
                  children: <SendAnnouncement />,
                })
              }
            >{locale.ui_announcement_title}</Button>

            <Button
              color='red.7'
              variant='light'
              size='xs'
              onClick={() =>
                openModal({
                  title: locale.ui_kickAll,
                  size: 'xs',
                  children: <KickAll />,
                })
              }
            >{locale.ui_kickAll}</Button>

            <Button
              color='orange.7'
              variant='light'
              size='xs'
              onClick={() =>
              openModal({
                  title: locale.ui_warnAll,
                  size: 'xs',
                  children: <WarnAll />,
                })
              }
            >{locale.ui_warnAll}</Button>

          </Group>
        </Paper>

        {/* CURRENT COORDS */}
        <Paper p='md'>
          
          <Group position='apart'>
            <Text size={20} weight={600}>{locale.ui_current_coords}</Text>
            <FaMapMarkerAlt size={24}/>
          </Group>
          
          <Space h='sm' />

          <Group position='apart'>
            <Group><Text>{locale.ui_coords}:</Text><Text color='blue.4' >{currentCoords}</Text></Group>
            <Group><Text>{locale.ui_heading}:</Text><Text color='blue.4' style={{ minWidth: '120px' }} >{currentHeading}</Text></Group>
          </Group>
          
          <Space h='sm' />

          <Group grow>
            <Button
              color={copiedCoords ? 'teal' : 'blue.4'}
              variant='light'
              size='xs'
              onClick={() => {
                setClipboard(currentCoords + ', ' + currentHeading)
                setCopiedCoords(true)
              }}
            >{copiedCoords ? locale.ui_copied_coords : locale.ui_copy_coords}</Button>

            <Button
              color='blue.4'
              variant='light'
              size='xs'
              onClick={() =>
              openModal({
                  title: locale.ui_set_coords,
                  size: 'xs',
                  children: <SetCoords />,
                })
              }
            >{locale.ui_set_coords}</Button>

            <Button
              color='blue.4'
              variant='light'
              size='xs'
              onClick={() =>
                openModal({
                  title: locale.ui_save_location,
                  size: 'xs',
                  children: <CreateLocation />,
                })
              }
            >{locale.ui_save_location}</Button>
          </Group>
        </Paper>
        
        {/* LAST LOCATION */}
        <Paper p='md'>
          <Group position='apart'>
            <Text size={20} weight={600}>{locale.ui_last_location}</Text>
            <BsFillPinMapFill size={24} />
          </Group>
          
          <Space h='sm' />
          
          {
            lastLocation
            ? 
              <>
                <Group><Text>{locale.ui_name}:</Text><Text color='blue.4' >{lastLocation.name}</Text></Group>
                
                <Group position='apart'>
                  <Group><Text>{locale.ui_coords}:</Text><Text color='blue.4' >{lastLocation.x}, {lastLocation.y}, {lastLocation.z}</Text></Group>
                  <Button
                    color='blue.4'
                    variant='light'
                    onClick={() =>
                      fetchNui('flight_admin:teleport', { name: lastLocation.name, x: lastLocation.x, y: lastLocation.y, z: lastLocation.z, heading: lastLocation.heading })
                    }
                    value={lastLocation.name}
                  >
                    {locale.ui_teleport}
                  </Button>
                </Group>
              </>
            :            
              <>
                <Space h='sm' />
                <Text color='red.4'>{locale.ui_no_last_location}</Text>
              </>
          }
        </Paper>

        {/* CURRENT INTERIOR */}
        {/* <Paper p='md'>
          <Group position='apart'>
            <Text size={20} weight={600}>{locale.ui_current_interior}</Text>
            <RiHomeGearFill size={24} />
          </Group>
         
          {
            interior.interiorId > 0
            ? 
              <>
                <Group><Text>{locale.ui_interior_id}:</Text><Text color='blue.4' >{interior.interiorId}</Text></Group>
                <Group><Text>{locale.ui_current_room}:</Text><Text color='blue.4' >{interior.currentRoom?.index} - {interior.currentRoom?.name}</Text></Group>
              </>
            : 
              <>
                <Space h='sm' />
                <Text color='red.4'>{locale.ui_not_in_interior}</Text>
              </>
          }
        </Paper> */}

        {/* QUICK ACTIONS */}
        <Paper p='md'>
          <Group position='apart'>
            <Text size={20} weight={600}>{locale.ui_quick_actions}</Text>
            <FiFastForward size={24} />
          </Group>

          <Space h='sm' />
          
          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:tpm', {})
              }
            >{locale.ui_tpm}</Button>
            
            <Button
              color={noclipActive ? 'red.4' : 'blue.4'}
              variant='light'
              onClick={() => {
                setNoclip(!noclipActive)
                fetchNui('flight_admin:noclip', !noclipActive)
              }}
            >{noclipActive ? locale.ui_exit_noclip : locale.ui_noclip }</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:revive')
              }
            >{locale.ui_revive}</Button>
          </Group>

          <Space h='sm' />

          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:cleanZone', {})
              }
            >{locale.ui_clean_zone}</Button>
            
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:cleanPed', {})
              }
            >{locale.ui_clean_ped}</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:setMaxHealth')
              }
            >{locale.ui_max_health}</Button>

          </Group>

          <Space h='sm' />

          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:repairVehicle', {})
              }
            >{locale.ui_repair_vehicle}</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:deleteVehicle', {})
              }
            >{locale.ui_delete_vehicle}</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:upgradeVehicle', {})
              }
            >{locale.ui_upgrade_vehicle}</Button>

          </Group>

          <Space h='sm' />

          <Group grow>
            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:spawnFavoriteVehicle', {})
              }
            >{locale.ui_spawn_vehicle}</Button>
            
            <Button
              color={timeFrozen ? 'red.4' : 'blue.4'}
              variant='light'
              onClick={() => {
                setTimeFrozen(!timeFrozen)
                fetchNui('flight_admin:freezeTime', !timeFrozen)
              }}
            >{timeFrozen ? locale.ui_time_freeze : locale.ui_time_not_freeze }</Button>

            <Button
              color='blue.4'
              variant='light'
              onClick={() =>
                fetchNui('flight_admin:setDay', {})
              }
            >{locale.ui_set_sunny_day}</Button>
          </Group>
        </Paper>
      </Stack>
    </SimpleGrid>
  )
}

export default Home
