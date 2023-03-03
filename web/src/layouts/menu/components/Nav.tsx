import { Navbar, Stack, Text } from '@mantine/core'
import { BiWorld } from 'react-icons/bi'
import { FaCar, FaMapMarkerAlt, FaDiscord } from 'react-icons/fa'
import { ImGithub } from 'react-icons/im'
import { GiPistolGun } from 'react-icons/gi'
import { IoMdCube } from 'react-icons/io'
import { RiHomeGearFill, RiHome2Fill } from 'react-icons/ri'
import { HiSpeakerWave } from 'react-icons/hi2'
import { CgLoadbar } from 'react-icons/cg'
import { fetchNui } from '../../../utils/fetchNui'
import { useLocales } from '../../../providers/LocaleProvider'
import NavIcon from './NavIcon'
import {BsFillPersonFill} from 'react-icons/bs'
import {MdPersonSearch} from 'react-icons/md'
import { Version } from '../../../atoms/version'

const Nav: React.FC = () => {
  const { locale } = useLocales()

  return (
    <Navbar
      width={{ base: 80 }}
      p='md'
      fixed={false}
      sx={{
        height: 775
      }}
    >
      <Navbar.Section grow>
        <Stack justify='center' spacing={2}>
          <NavIcon color='blue.4' tooltip={locale.ui_home} Icon={RiHome2Fill} to='/' handleClick={() => fetchNui('flight_admin:tabSelected', 'home')} />
          <NavIcon color='blue.4' tooltip={locale.ui_players} Icon={MdPersonSearch} to='/players'  handleClick={() => fetchNui('flight_admin:tabSelected', 'players')}/>
          <NavIcon color='blue.4' tooltip={locale.ui_world} Icon={BiWorld} to='/world' handleClick={() => fetchNui('flight_admin:tabSelected', 'world')} />
          <NavIcon color='blue.4' tooltip={locale.ui_locations} Icon={FaMapMarkerAlt} to='/locations'  handleClick={() => fetchNui('flight_admin:tabSelected', 'locations')}/>
          <NavIcon color='blue.4' tooltip={locale.ui_peds} Icon={BsFillPersonFill} to='/ped'  handleClick={() => {fetchNui('flight_admin:tabSelected', 'peds')}}/>
          <NavIcon color='blue.4' tooltip={locale.ui_vehicles} Icon={FaCar} to='/vehicles'  handleClick={() => fetchNui('flight_admin:tabSelected', 'vehicles')}/>
          <CgLoadbar fontSize={34}/>
          <NavIcon color='cyan.4' tooltip={locale.ui_object_spawner} Icon={IoMdCube} to='/object'  handleClick={() => fetchNui('flight_admin:tabSelected', 'object')}/>
          <NavIcon color='cyan.4' tooltip={locale.ui_interior} Icon={RiHomeGearFill} to='/interior'  handleClick={() => fetchNui('flight_admin:tabSelected', 'interior')}/>
          <NavIcon color='cyan.4' tooltip={locale.ui_weapons} Icon={GiPistolGun} to='/weapon'  handleClick={() => fetchNui('flight_admin:tabSelected', 'weapons')}/>
          <NavIcon color='cyan.4' tooltip={locale.ui_audio} Icon={HiSpeakerWave} to='/audio'  handleClick={() => fetchNui('flight_admin:tabSelected', 'audio')}/>
          <CgLoadbar fontSize={34}/>
          <NavIcon color='dark.2' tooltip={"Discord"} Icon={FaDiscord} to='' handleClick={() => fetchNui('flight_admin:openBrowser', { url: 'https://discord.gg/dXzkPaRaq3' })}/>
          <NavIcon color='dark.2' tooltip={"Github"} Icon={ImGithub} to='' handleClick={() => fetchNui('flight_admin:openBrowser', { url: 'https://github.com/DevTheBully/flight_admin/' })}/>
        </Stack>
      </Navbar.Section>
    </Navbar>
  )
}

export default Nav
