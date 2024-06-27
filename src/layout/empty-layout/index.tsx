import * as React from 'react';
import { Outlet } from 'react-router-dom';
import './index.css'

const EmptyLayout = (props : any ) => {
  return (
    <>
      {props.children ? props.children : <Outlet />}
      <img className='maskImg' src="/images/auth-v1-mask-light.png" alt='maskImage' />
      <img className='tree1Img' src="/images/auth-v1-tree-c.png" alt='maskImage' />
      <img className='tree2Img' src="/images/auth-v1-tree-2-c.png" alt='maskImage' />
    </>
  );
};

export default EmptyLayout;
