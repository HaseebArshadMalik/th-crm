import React from 'react'
import './index.css'

const Logo = ({logoOuter} :any) => {
  return (
    <>
        <div className={'siteLogo' + " " + logoOuter}>
            <img src="/logo-top.svg" alt='logo' />
            {/* <span>CRM</span> */}
        </div>
    </>
  )
}

export default Logo