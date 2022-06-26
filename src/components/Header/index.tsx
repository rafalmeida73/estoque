import { Navbar, Icon } from 'react-materialize';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import styles from './Header.module.scss';

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = async () => {
    signOut();
    router.push('/');
  };

  return (
    <div className={`navbar-fixed ${styles.container}`}>
      <Navbar
        alignLinks="right"
        brand={(
          <div title="Início">
            <Link href={`${session ? '/menu' : '/'}`}>
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
        <Link href={`${session ? '/menu' : '/'}`}>
          <a>{session ? 'Início' : 'Entrar'}</a>
        </Link>

        {!session && (
        <Link href="/cadastro">
          <a>Cadatrar</a>
        </Link>
        )}

        {session && (
        <Link href="/depositos">
          <a>Depósitos</a>
        </Link>
        )}

        {session && (
        <Link href="/movimentacoes">
          <a>Movimentações</a>
        </Link>
        )}

        {session && (
        <Link href="/produtos">
          <a>Produtos</a>
        </Link>
        )}

        {session && (
        <Link href="/fornecedores">
          <a>Fornecedores</a>
        </Link>
        )}

        {session && (
        <button type="button" onClick={handleSignOut}>
          <a>Sair</a>
        </button>
        )}

      </Navbar>
    </div>
  );
};

export default Header;
