import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SSRProps } from '@/typing';

export async function getServerSideProps<T>({ req, res }: { req: Request; res: Response }) {
  const { pageData, globalData } = req as any;
  return {
    props: {
      pageData: stringifyObject(pageData) as T,
      globalData,
    },
  };
}

// 递归处理 object 如果数据类型无法被 json，则进行 toString
export function stringifyObject(obj: any) {
  // 判断是否为 Date 类型
  if (obj instanceof Date) {
    return obj.toISOString();
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        obj[key] = stringifyObject(obj[key]);
      } else {
        obj[key] = obj[key];
      }
    }
  }
  return obj;
}
export function createPage<T extends (...args: any) => any>(component: React.FC<SSRProps<T>>) {
  const ssrPage: React.FC<SSRProps<T>> = (props) => {
    return (
      <>
        <Header />
        <main className="wp layoutContainer">{component(props)}</main>
        <Footer />
      </>
    );
  };
  ssrPage.displayName = component.displayName || component.name;
  return ssrPage;
}
