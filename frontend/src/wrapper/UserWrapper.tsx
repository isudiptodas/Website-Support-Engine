import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function UserWrapper({ children }: { children: React.ReactNode }) {

    const [verified, setVerified] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-verify`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setVerified(true);
                }
            } catch (error) {
                setVerified(false);
            }
        }

        verifyUser();
    }, []);

    if (verified === null) return null;

    if (!verified) return <Navigate to="/auth/login" replace />;

    return <>{children}</>;
}

export default UserWrapper