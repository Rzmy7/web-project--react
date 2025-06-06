import styled from "styled-components";



const UserDetails = styled.div`
  position: absolute;
  top: 2.5rem;
  right: 0;
  background: white;
  color: var(--text-color);
  border: 1px solid var(--medium-gray);
  padding: 1rem;
  border-radius: 0.3rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 2000;
  width: max-content;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;
  overflow-x: auto;
  border: 2px solid var(--light-gray);

  @media (max-width: 768px){
    width: 100%;
  }
`;

const UserNameTitle = styled.p`
    font-weight: 600;
`;

const UserInfos = styled.p`
    span{
        font-style: italic;
    }
`;


const LogoutBtn = styled.button`
  background-color: var(--accent-color);
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  margin-top: 1rem;
  border-radius: 0.2rem;
  cursor: pointer;

  &:hover {
    background-color: var(--hover-accent-color);
  }
`;

const UserProfile=({user,setUser,setIsLoggedIn,setShowUserDetails})=>{

    const handleLogout = () => {
      localStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setShowUserDetails(false);
    };
    
    return(
<UserDetails>
        <UserNameTitle>{user.name}</UserNameTitle>
        <UserInfos><span>{user.email}</span></UserInfos>
        <UserInfos>Index:<span> {user.indexNumber}</span></UserInfos>
        <UserInfos>Mobile: <span>{user.mobileNumber}</span></UserInfos>
        <LogoutBtn onClick={handleLogout}>Log Out</LogoutBtn>
      </UserDetails>
    );
}

export default UserProfile;

