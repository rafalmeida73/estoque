import { Navbar, Icon } from 'react-materialize';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.scss';

const Header = () => (
  <div className={`navbar-fixed ${styles.container}`}>
    <Navbar
      alignLinks="right"
      brand={(
        <div title="Início">
          <Link href="/">
            <a>
              <Image
                src="/logo.jpg"
                width={50}
                height={50}
                alt="Circulo laranja com uma bola de futebol no centro"
              />
              <p>Estoque</p>
            </a>
          </Link>

        </div>
        )}
      id="mobile-nav"
      menuIcon={<Icon>menu</Icon>}
      options={{
        draggable: true,
        edge: 'left',
        inDuration: 250,
        outDuration: 200,
        preventScrolling: true,
      }}
    >
      <Link href="/menu">
        <a>Início</a>
      </Link>
      <Link href="/depositos">
        <a>Depósitos</a>
      </Link>
      <Link href="/">
        <a>Movimentações</a>
      </Link>
      <Link href="/">
        <a>Produtos</a>
      </Link>
      <Link href="/">
        <a>Fornecedores</a>
      </Link>
      <Link href="/">
        <a>Sair</a>
      </Link>

    </Navbar>
  </div>
);

export default Header;
