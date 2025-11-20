import { Box } from '@mantine/core'
import { ReactNode } from 'react'
import styles from './Grid.module.scss'

type Props = {
  children: ReactNode
}

const Grid = (props: Props) => {
  return (
    <Box
      className={styles.box}
    >
      {props.children}
    </Box>
  )
}

export default Grid
