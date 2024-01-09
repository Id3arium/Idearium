import "@/app/styles.css";
import { useUser, SignOutButton } from "@clerk/nextjs";
export default function UserDashboard() {
    const { isSignedIn, user } = useUser();
    if (!isSignedIn) {
        return null;
    }

    const name = user.fullName;
    const email = user.primaryEmailAddress.emailAddress;
    const id = user.id;

    return (
        <div className="bg-blue h-200px w-600px p-4 rounded shadow-md border-2 border-white">
            <div className="absolute m-auto top-0 right-0">
                <SignOutButton />
            </div>
            <p className="font-bold text-white">Name: {name}</p>
            <p className="font-bold text-white">Email: {email}</p>
            <p className="font-bold">ID: {id}</p>
            <div>
                <h2 className="font-bold mt-4">Your Constellations:</h2>
                {/* <ul>
                    {constellations.map((constellation, index) => (
                        <li key={index}>{constellation}</li>
                    ))}
                </ul> */}
            </div>
        </div>
    );
}
