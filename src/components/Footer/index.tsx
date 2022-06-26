import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'react-materialize';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import styles from './Footer.module.scss';

export const Footer = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // for smoothly scrolling
    });
  };

  const handleSignOut = async () => {
    signOut();
    router.push('/');
  };

  return (
    <footer className={`page-footer ${styles.container}`}>
      <div className="container">
        <div className="row">
          <div className="col l9 s12">
            <h5 className="white-text">Estoque</h5>
          </div>
          <div className="col l2  s12">
            <ul>

              {session ? (
                <>
                  <li><Link href="/menu">Início</Link></li>
                  <li><Link href="/depositos">Depósitos</Link></li>
                  <li><Link href="/movimentacoes">Movimentações</Link></li>
                  <li><Link href="/produtos">Produtos</Link></li>
                  <li><Link href="/fornecedores">Fornecedores</Link></li>
                  <li>
                    <button type="button" onClick={handleSignOut}>
                      <a>Sair</a>
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link href="/">Entrar</Link></li>
                  <li><Link href="/cadastro">Cadastrar</Link></li>
                </>
              )}

            </ul>
          </div>
          <div className={`col l1 s12 ${styles.image}`}>
            <Button
              node="button"
              tooltip="Ir para o topo"
              waves="light"
              onClick={scrollToTop}
            >
              <Image
                src="/up.svg"
                width={50}
                height={50}
                alt="Seta apontando para cima"
              />
            </Button>
          </div>
        </div>
      </div>
      <div className="footer-copyright">
        <div className="container">
          © 2022 Copyright
        </div>
      </div>
    </footer>
  );
};
