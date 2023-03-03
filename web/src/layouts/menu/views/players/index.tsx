import { Accordion, Button, Group, Paper, ScrollArea, Stack, Text, Image, Center, Pagination, Space, Badge } from '@mantine/core'
import { useEffect, useState} from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { getSearchPlayerInput, playersPageCountAtom, playersActivePageAtom, playersPageContentAtom, PlayerInfo } from '../../../../atoms/player'
import { displayImageAtom, imagePathAtom } from '../../../../atoms/imgPreview'
import { setClipboard } from '../../../../utils/setClipboard'
import PlayerSearch from './components/playerListSearch'
import { fetchNui } from '../../../../utils/fetchNui'
import { useNuiEvent } from '../../../../hooks/useNuiEvent'
import { useLocales } from '../../../../providers/LocaleProvider'
import {FaDiscord, FaSteam, FaDiceFive, FaXbox} from 'react-icons/fa'
import {ImConnection} from 'react-icons/im'
import {TbLivePhoto} from 'react-icons/tb'
import { openModal } from '@mantine/modals'
import SendWarn from './modals/SendWarn'
import SetCoords from './modals/SetCoords'
import TrollMenu from './modals/TrollMenu'
import YeetPlayer from './modals/YeetPlayer'

const Players: React.FC = () => {
  const { locale } = useLocales()
  const searchPlayerValue = getSearchPlayerInput()
  const [pageContent, setPageContent] = useRecoilState(playersPageContentAtom)
  const [pageCount, setPageCount] = useRecoilState(playersPageCountAtom)
  const [activePage, setPage] = useRecoilState(playersActivePageAtom)
  const [pressSpectate, setPressSpectate] = useState(false)

  useNuiEvent('setPageContent', (data: {type: string, content: PlayerInfo[], maxPages: number, spectate: boolean}) => {
    if (data.type === 'players') {
      setPageContent(data.content)
      setPageCount(data.maxPages)
      setPressSpectate(data.spectate)
    }
  })

  const [copiedLicense, setCopiedLicense] = useState(false)
  const [copiedDiscord, setCopiedDiscord] = useState(false)
  const [copiedSteam, setCopiedSteam] = useState(false)
  const [copiedFivem, setCopiedFivem] = useState(false)
  const [copiedIP, setCopiedIP] = useState(false)
  const [copiedLive, setCopiedLive] = useState(false)
  const [copiedXbl, setCopiedXbl] = useState(false)
  const [pressHeal, setPressHeal] = useState(false)
  const [pressRevive, setPressRevive] = useState(false)
  const [pressNoClip, setPressNoClip] = useState(false)
  const [pressBring, setPressBring] = useState(false)
  const [pressGoTo, setPressGoTo] = useState(false)
  const [pressTpIntoVeh, setPressTpIntoVeh] = useState(false)
  const [pressTpMarker, setPressTpMarker] = useState(false)
  const [pressFreeze, setPressFreeze] = useState(false)
  const [pressKill, setPressKill] = useState(false)

  const [currentAccordionItem, setAccordionItem] = useState<string|null>('0')

  const displayImage = useSetRecoilState(displayImageAtom)
  const imagePath = useSetRecoilState(imagePathAtom)

  useEffect(() => { setTimeout(() => { if (copiedLicense) setCopiedLicense(false)}, 1000)}, [copiedLicense, setCopiedLicense])
  useEffect(() => { setTimeout(() => { if (copiedDiscord) setCopiedDiscord(false)}, 1000)}, [copiedDiscord, setCopiedDiscord])
  useEffect(() => { setTimeout(() => { if (copiedSteam) setCopiedSteam(false)}, 1000)}, [copiedSteam, setCopiedSteam])
  useEffect(() => { setTimeout(() => { if (copiedFivem) setCopiedFivem(false)}, 1000)}, [copiedFivem, setCopiedFivem])
  useEffect(() => { setTimeout(() => { if (copiedIP) setCopiedIP(false)}, 1000)}, [copiedIP, setCopiedIP])
  useEffect(() => { setTimeout(() => { if (copiedLive) setCopiedLive(false)}, 1000)}, [copiedLive, setCopiedLive])
  useEffect(() => { setTimeout(() => { if (copiedXbl) setCopiedXbl(false)}, 1000)}, [copiedXbl, setCopiedXbl])
  useEffect(() => { setTimeout(() => { if (pressHeal) setPressHeal(false)}, 1000)}, [pressHeal, setPressHeal])
  useEffect(() => { setTimeout(() => { if (pressRevive) setPressRevive(false)}, 1000)}, [pressRevive, setPressRevive])
  useEffect(() => { setTimeout(() => { if (pressTpIntoVeh) setPressTpIntoVeh(false)}, 1000)}, [pressTpIntoVeh, setPressTpIntoVeh])
  useEffect(() => { setTimeout(() => { if (pressTpMarker) setPressTpMarker(false)}, 1000)}, [pressTpMarker, setPressTpMarker])
  useEffect(() => { setTimeout(() => { if (pressKill) setPressKill(false)}, 1000)}, [pressKill, setPressKill])



  const PlayerList = pageContent?.map((playerList: any, index: number) => (
      <Accordion.Item key={index} value={index.toString()}>
        <Accordion.Control>
          <Group position='apart'> 
            <Text size='md' weight={500}>• {playerList.name} | {playerList.id}</Text>
            <Badge color={playerList.rank !== 0 ? 'orange.' + playerList.rank : 'blue.2'}>{playerList.rank !== 0 ? playerList.label : "User"}</Badge>
          </Group>
          <Badge size='sm' color={'blue.3'}onClick={() => {
                setClipboard(playerList.discord)
                setCopiedLicense(true)
              }}>
                {playerList.license}
          </Badge>
        </Accordion.Control>
        <Accordion.Panel>
          <Group grow spacing='xs'> 
            <Badge color={copiedDiscord ? 'teal' : 'violet.5'}  
              onClick={() => {
                setClipboard(playerList.discord)
                setCopiedDiscord(true)
              }}>
              <Group grow spacing='xs'> 
                <FaDiscord fontSize={15}/>
                {!copiedDiscord ? playerList.discord : "Copied"}
              </Group>
            </Badge>
            <Badge color={copiedSteam ? 'teal' : 'gray.5'}  
              onClick={() => {
                setClipboard(playerList.steam)
                setCopiedSteam(true)
              }}>
              <Group grow spacing='xs'> 
                <FaSteam fontSize={15}/>
                {!copiedSteam ? playerList.steam : "Copied"}
              </Group>
            </Badge>
          </Group>
          <Space h='xs' />
          <Group grow spacing='xs'> 
            <Badge color={copiedFivem ? 'teal' : 'orange.4'}  
              onClick={() => {
                setClipboard(playerList.fivem)
                setCopiedFivem(true)
              }}>
              <Group grow spacing='xs'> 
                <FaDiceFive fontSize={13}/>
                {!copiedFivem ? playerList.fivem : "Copied"}
              </Group>
            </Badge>
            <Badge color={copiedIP ? 'teal' : 'teal.5'}  
              onClick={() => {
                setClipboard(playerList.ip)
                setCopiedIP(true)
              }}>
              <Group grow spacing='xs'> 
                <ImConnection fontSize={15}/>
                {!copiedIP ? "Click To Copy IP" : "Copied"}
              </Group>
            </Badge>
          </Group>
          <Space h='xs' />
          <Group grow spacing='xs'> 
            <Badge color={copiedLive ? 'teal' : 'cyan.4'}  
              onClick={() => {
                setClipboard(playerList.live)
                setCopiedLive(true)
              }}>
              <Group grow spacing='xs'> 
                <TbLivePhoto fontSize={13}/>
                {!copiedLive ? playerList.live : "Copied"}
              </Group>
            </Badge>
            <Badge color={copiedXbl ? 'teal' : 'green.5'}  
              onClick={() => {
                setClipboard(playerList.xbl)
                setCopiedXbl(true)
              }}>
              <Group grow spacing='xs'> 
                <FaXbox fontSize={13}/>
                {!copiedXbl ? playerList.xbl : "Copied"}
              </Group>
            </Badge>
          </Group>
          <Space h='xs' />
          <Group grow spacing='xs'>
            <Image
              onMouseEnter={() => {
                displayImage(true)
                imagePath(`nui://flight_admin/shared/img/vehicle/${playerList.name}.webp`)
              }}
              onMouseLeave={() => {displayImage(false)}}
              height={50}
              fit='contain'
              alt={`${playerList.name}`}
              src={`nui://flight_admin/shared/img/vehicle/${playerList.name}.webp`}
              withPlaceholder={true}
              sx={{
                '&:hover':{
                  borderRadius: '5px',
                  backgroundColor: 'rgba(35, 35, 35, 0.75)'
                }
              }}
            />
            <Button
              variant='light'
              color={pressRevive ? 'teal' : 'blue.4'}
              size='xs'
              onClick={() => { 
                setPressRevive(true)
                fetchNui('flight_admin:revive', playerList.id)
              }}
            >
              {pressRevive ? locale.ui_revived : locale.ui_revive}
            </Button>
            <Button
              variant='light'
              color={pressHeal ? 'teal' : 'blue.4'}
              size='xs'
              onClick={() => {
                setPressHeal(true)
                fetchNui('flight_admin:setMaxHealth', playerList.id)
              }}
            >
              {pressHeal ? locale.ui_healed : locale.ui_heal}
            </Button>              
            <Button
              variant='light'
              color={playerList.noclip ? 'red.4' : 'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:setNoClip', playerList.id)
              }}
            >
              {playerList.noclip ? locale.ui_exit_noclip : locale.ui_noclip}
            </Button>     
          </Group>
          <Space h='xs' />
          <Group grow spacing='xs'> 
            <Button
              variant='light'
              color={pressTpIntoVeh ? 'teal.4' : 'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:tpIntoVehPlayer', playerList.id)
                setPressTpIntoVeh(true)
              }}
            >
              {locale.ui_tp_into_veh}
            </Button>
            <Button
              variant='light'
              color={'blue.4'}
              size='xs'
              onClick={() => {
                openModal({
                  title: "Warn",
                  size: 'lg',
                  children: <SendWarn id = {playerList.id}/>,
                })
              }}
            >
              {locale.ui_warn}
            </Button>
            <Button
              variant='light'
              color={'blue.4'}
              size='xs'
              onClick={() => {
                openModal({
                  title: locale.ui_tp_coords,
                  size: 'sm',
                  children: <SetCoords id = {playerList.id}/>,
                })  
              }}
            >
              {locale.ui_tp_coords}
            </Button>
            <Button
              variant='light'
              color={pressTpMarker ? 'teal' : 'blue.4'}
              size='xs'
              onClick={() => {
                setPressTpMarker(true)
                fetchNui('flight_admin:tpMarkerPlayer', playerList.id)
              }}
            >
              {locale.ui_tpm}
            </Button>                     
          </Group>
          <Space h='md' />
          <Group grow spacing='xs'> 
           <Button
              variant='light'
              color={pressSpectate ? 'red.4' : 'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:spectatePlayer', playerList.id)
              }}
            >
              {pressSpectate ? "Exit Spectate" : locale.ui_spectate}
            </Button>
            <Button
              variant='light'
              color={playerList.freeze ? 'red.4' : 'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:freezePlayer', playerList.id)
              }}
            >
              {playerList.freeze ? "UnFreeze" : "Freeze"}
            </Button>
            <Button
              variant='light'
              color={pressKill ? 'teal' : 'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:killPlayer', playerList.id)
                setPressKill(true)
              }}
            >
              {locale.ui_kill}
            </Button>
            <Button
              variant='light'
              color={'blue.4'}
              size='xs'
              onClick={() => {
                openModal({
                  title: locale.ui_tp_coords,
                  size: 'sm',
                  children: <TrollMenu id={playerList.id}/>,
                })  
              }}
            >
              {locale.ui_troll}
            </Button>                     
          </Group>

          <Space h='md' />
          <Group grow spacing='xs'> 
            <Button
              variant='light'
              color={'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:bringPlayer', playerList.id)
              }}
            >
              {locale.ui_bring}
            </Button>
            { playerList.bringPlayer ? 
              <Button
                variant='light'
                color={'red.4'}
                size='xs'
                onClick={() => {
                  fetchNui('flight_admin:bringBackPlayer', playerList.id)
                }}
              >
                {locale.ui_bring_back}
              </Button> 
            : ''}
            { playerList.gotoPlayer ? 
              <Button
                variant='light'
                color={'red.4'}
                size='xs'
                onClick={() => {
                  fetchNui('flight_admin:goBackPlayer', playerList.id)
                }}
              >
                {locale.ui_goto_back}
              </Button> 
            : ''}
            <Button
              variant='light'
              color={'blue.4'}
              size='xs'
              onClick={() => {
                fetchNui('flight_admin:gotoPlayer', playerList.id)
              }}
            >
              {locale.ui_goto}
            </Button>
          </Group>
          <Space h='md' />
          <Group grow spacing='xs'> 
           <Button
              variant='light'
              color={'orange.4'}
              size='xs'
              onClick={() => openModal({
                title: locale.ui_tp_coords,
                size: 'sm',
                children: <YeetPlayer type = "kick" id = {playerList.id}/>,
              })  
              }
            >
              {locale.ui_kick}
            </Button>
            <Button
              variant='light'
              color={'red.4'}
              size='xs'
              onClick={() => openModal({
                title: locale.ui_tp_coords,
                size: 'sm',
                children: <YeetPlayer id = {playerList.id} type = "ban"/>,
              })  
              }
            >
              {locale.ui_ban}
            </Button>
          </Group>
        </Accordion.Panel>
      </Accordion.Item>
  ))

  return(
    <Stack>
      <Text size={20}>{locale.ui_players}</Text>
      <Group grow>
        <PlayerSearch/>
        {/* <Button
          disabled={searchPlayerValue === ''}
          uppercase
          variant='light'
          color='blue.4'
          onClick={() => fetchNui('flight_admin:spawnVehicle', searchPlayerValue)}
        >
          {locale.ui_spawn_by_name}
        </Button> */}
      </Group>
      <ScrollArea style={{ height: 575 }} scrollbarSize={0}>
        <Stack>
          <Accordion variant='contained' radius='sm' value={currentAccordionItem} onChange={setAccordionItem}>
            {PlayerList ? PlayerList : 
              <Paper p='md'>
                <Text size='md' weight={600} color='red.4'>No players found</Text>
              </Paper>
            }
            </Accordion>
        </Stack>
      </ScrollArea>
      <Center>
        <Pagination
          color='blue.4'
          size='sm'
          page={activePage}
          onChange={(value) => {
            fetchNui('flight_admin:loadPages', { type: 'players', activePage: value, filter: searchPlayerValue })
            setPage(value)
            setAccordionItem('0')
          }}
          total={pageCount}
        />
      </Center>
    </Stack>
  )

}

export default Players