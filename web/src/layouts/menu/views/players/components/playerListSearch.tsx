import { useEffect, useState } from 'react'
import { TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { TbSearch } from 'react-icons/tb'
import { playerListSearchAtom, playersActivePageAtom } from '../../../../../atoms/player'
import { fetchNui } from '../../../../../utils/fetchNui'
import { useLocales } from '../../../../../providers/LocaleProvider'

const playerListSearch: React.FC = () => {
  const { locale } = useLocales()
  const [searchPlayer, setSearchPlayer] = useState('')
  const setPlayerSearch = useSetRecoilState(playerListSearchAtom)
  const [debouncedPlayerSearch] = useDebouncedValue(searchPlayer, 200)
  const setActivePage = useSetRecoilState(playersActivePageAtom)

  useEffect(() => {
    setPlayerSearch(debouncedPlayerSearch)
    fetchNui('flight_admin:loadPages', { type: 'players', activePage: 1, filter: debouncedPlayerSearch })
  }, [debouncedPlayerSearch])

  return (
    <>
      <TextInput
        placeholder={locale.ui_search}
        icon={<TbSearch size={20} />}
        value={searchPlayer}
        onChange={(e) => {
          setActivePage(1)
          setSearchPlayer(e.target.value)
        }}
      />
    </>
  )
}

export default playerListSearch
