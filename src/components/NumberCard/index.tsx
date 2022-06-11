import Link from 'next/link';
import { Icon } from 'react-materialize';
import styles from './NumberCard.module.scss';

interface NumberCardProps{
  title: string;
  icon: string;
  number: number
}

const NumberCard = ({ icon, number, title }:NumberCardProps) => (
  <Link href="/">
    <div className={styles.container}>
      <div className={styles.title}>
        <Icon medium>
          {icon}
        </Icon>
        <p>{title}</p>
      </div>
      <p>{number}</p>
    </div>
  </Link>
);

export default NumberCard;
