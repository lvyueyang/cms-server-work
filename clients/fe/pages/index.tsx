import React from 'react';
import { NextPage } from 'next';

const Home: NextPage = (props) => {
  console.log('props: ', props);
  return (
    <div>
      <h1>Hello from NextJS! - Index</h1>
    </div>
  );
};

export default Home;
