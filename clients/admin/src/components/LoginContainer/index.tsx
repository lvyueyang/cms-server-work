import LOGO from '@/assets/logo.png';
import styles from './index.module.less';

export default function LoginContainer({ children }: React.PropsWithChildren) {
  return (
    <div className={styles.loginContainer}>
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: '#fff',
        }}
      >
        <img
          src={LOGO}
          alt=""
          style={{ width: 420 }}
        />
      </div>
      <div className={styles.wrap}>{children}</div>
    </div>
  );
}
