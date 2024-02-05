import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import logo from '../../assets/images/brandlogo.svg'
import { connect } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { showRightSidebarAction, toggleLeftmenu } from "../../store/actions";
import { MdOutlineAccountCircle } from "react-icons/md";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { fetchUserAttributes } from "aws-amplify/auth";

interface HeaderProps {
  leftMenu: any;
  showRightSidebar: any;
  showRightSidebarAction: () => void;
  t: any;
  toggleLeftmenu: () => void;
}
interface UserAttributes {
  'custom:firstname': string ;
  'custom:lastname': string;
  email: string;
  email_verified: string;
  phone_number: string;
  phone_number_verified: string;
  sub: string;
}

const Header: React.FC<HeaderProps> = (props) => {
  const { user, signOut } = useAuthenticator();
  const [userDetails, setUserDetails] = useState<UserAttributes | null>(null);
 
  const getuser=async ()=>{
    const userAttributes = await fetchUserAttributes();
    setUserDetails(userAttributes)
  }
  useEffect(()=>{
    getuser()

  },[user])
  
  const navigate = useNavigate();

  const handleAccountIconClick = () => {
    if (user) {
      signOut();

    } else {
      navigate("/login");
    }
  };

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="navbar-brand-box d-flex w-100 justify-content-between">
            <Link to="/" className="logo logo-dark">
              <img src={logo} alt="brand logo" />
            </Link>
            
            <Link to="/login" className="logo logo-dark" onClick={handleAccountIconClick}>
              <MdOutlineAccountCircle fontSize={25} />
              {userDetails && <span>{userDetails && userDetails?.['custom:firstname']}</span>}
            </Link>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
};

const mapStateToProps = (state: any) => {
  const { layoutType, showRightSidebar, leftMenu } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu };
};

export default connect(mapStateToProps, {
  showRightSidebarAction,
  toggleLeftmenu,
})(Header);
