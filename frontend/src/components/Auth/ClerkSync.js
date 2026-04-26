import React, { useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';  //useUser Hook
import { useNavigate } from 'react-router-dom';
import { socialLogin } from '../../services/authService';

const ClerkSync = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {      //useUser Hook
    const syncUser = async () => {
      if (isLoaded && isSignedIn && user) {
        // If already synced and on login page, just go to dashboard
        if (localStorage.getItem("currentUserId") && window.location.pathname === "/login") {
          navigate("/dashboard");
          return;        
        }
        

      //Get Email

        try {
          const syncData = {
            email: user.primaryEmailAddress.emailAddress,
            name: user.fullName || user.username,
            clerkId: user.id
          };
          
          const resp = await socialLogin(syncData);
          
          localStorage.setItem("currentUserId", resp.data.itNumber);
          localStorage.setItem("currentUserName", resp.data.name);
          
          console.log("Clerk synced with Backend successfully");
          
          // Force navigate to dashboard if we are stuck on login
          
          if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            navigate("/dashboard");
          }
        } catch (error) {
          console.error("Failed to sync Clerk with Backend", error);
        }
      }
    };

    syncUser();
  }, [isLoaded, isSignedIn, user, navigate]);

  return null;
};

export default ClerkSync;
