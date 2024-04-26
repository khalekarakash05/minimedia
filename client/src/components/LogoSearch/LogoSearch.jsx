

import React from "react";
import Logo from "../../img/logo.png";
import './LogoSearch.css'
import { UilSearch } from '@iconscout/react-unicons'

const LogoSearch = () => {
  return (
    <div className="LogoSearch">
      <div className="LogoContainer">
        <img src={Logo} alt="" className="Logo" />
      </div>
      <div className="Search">
        <input type="text" placeholder="#Explore" />
        <div className="s-icon">
          <UilSearch />
        </div>
      </div>
    </div>
  );
};

export default LogoSearch;