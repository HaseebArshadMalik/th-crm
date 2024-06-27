
import React from 'react';
import { Link } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import './index.css'

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  },
}));

const Header = () => {

  return (
    <>
      <div className='headerInner'>
        <div>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
          >
            <Avatar className='userAvatar' alt="Remy Sharp" src="./avatar.jpg" />
          </StyledBadge>
        </div>
      </div>
    </>
  );
};

export default Header;