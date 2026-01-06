import { Anchor, Text } from '@mantine/core';
import styles from './Card.module.scss';

type Props = {
  title: string;
  description: string;
  link: string;
};

const Card = (props: Props) => {
  return (
    <Anchor href={props.link} target="_blank" className={styles.button}>
      <Text component="h2" className={styles.title}>
        {props.title}
      </Text>
      <Text component="p" className={styles.description}>
        {props.description}
      </Text>
    </Anchor>
  );
};

export default Card;
