import { MantineThemeOverride, Accordion } from '@mantine/core';

const radius = '10px'
const mainBackgroundColor = 'rgb(16, 20, 24)'
const borderColor = 'rgb(20, 25, 31)'
export const customTheme: MantineThemeOverride = {
  colorScheme: 'dark',
  fontFamily: 'Roboto',
  shadows: { sm: '1px 1px 3px rgba(0, 0, 0, 0.5)' },
  components: {
    Header: {
      styles: {
        root: {
          height: '100%',
          backgroundColor: mainBackgroundColor,
          borderTopLeftRadius: radius,
          borderTopRightRadius: radius,
          borderColor: borderColor
        }
      }
    },
    AppShell: {
      styles: {
        main: {
          backgroundColor: mainBackgroundColor,
          borderBottomRightRadius: radius,
          borderColor: borderColor
        }
      }
    },
    Navbar: {
      styles: {
        root: {
          backgroundColor: mainBackgroundColor,
          borderBottomLeftRadius: radius,
          borderColor: borderColor,
        }
      }
    },
    Paper: {
      styles: {
        root: {
          backgroundColor: 'rgb(20, 25, 31)',
          borderRadius: '5px',
        }
      }
    },
    Accordion: {
      styles: {
        item: {
          backgroundColor: 'rgb(20, 25, 31)',
          borderColor: 'rgb(22, 27, 33)',
          '&[data-active]': {
            backgroundColor: 'rgb(22, 27, 33)',
            borderColor: 'rgb(25, 29, 35)',
          },
          '&[data-hovered]': {
            backgroundColor: 'rgb(25, 29, 35)'
          }
        },
        control:{
          '&:hover':{
            backgroundColor: 'rgb(25, 29, 35)'
          }
        }
      }
    },
    Input: {
      styles: {
        input: {
          backgroundColor: 'rgb(22, 27, 33)',
          borderRadius: '5px',
          borderColor: borderColor,
        }
      }
    },
  }
}