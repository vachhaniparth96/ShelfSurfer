import { useState, useEffect, useContext, createContext } from "react";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Link } from "react-router-dom";
import User from "../../Pages/User";
import { FcGoogle } from "react-icons/fc";


const Login = () => {
	const [user, setUser] = useState(null);
	const [profile, setProfile] = useState(null); //migrate into app and make avail through context
	const profileContext = createContext();

	const login = useGoogleLogin({
		onSuccess: (res) => setUser(res),
		onError: (err) => {
			console.log("Login Failed: ", err);
		},
	});

	useEffect(() => {
		if (user) {
			axios
				.get(
					`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${user.access_token}`,
					{
						headers: {
							Authorization: `Bearer ${user.access_token}`,
							Accept: "application/json",
						},
					}
				)
				.then((res) => {
                    console.log(user.access_token)
					setProfile(res.data);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	}, [user]);

	console.log(profile, "Profile");
    
	const logout = () => {
		googleLogout({
            clientId:
				"920647848413-l3qou40fccmtfnv10d03qpj5k661cou9.apps.googleusercontent.com",
            });
		setUser(null);
		setProfile(null);
	};
                <profileContext.Provider value={profile}>
                    {console.log(profileContext, "Profile Context")}
                    <User />
                </profileContext.Provider>;
	return (
		<div className="border-2 border-gray-500 rounded-lg">
			{profile ? (
				<div>
					{/* <Link to={`user/${profile.id}`}>
						<p>Profile</p>
					</Link> */}
					{/* <h3>User Logged in</h3> */}
					{/* <p>Name: {profile.name}</p> */}
					{/* <p>Email Address: {profile.email}</p> */}
					<button className="flex rounded-lg px-2 bg-white hover:bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 hover:text-white" onClick={logout}>Log out</button>
				</div>
			) : (
				<button className="flex rounded-lg px-2 bg-white hover:bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 hover:text-white" onClick={() => login()}><FcGoogle size="23px"/>&nbsp;Login</button>
			)}
		</div>
	);
};

    export default Login;