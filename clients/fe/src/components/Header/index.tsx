import React from 'react';
export default function Header() {
  return <div>这是 Header</div>;
}
export async function getServerSideProps<T>({ req, res }) {
  console.log('req: ', req);
  return {
    props: {},
  };
}
