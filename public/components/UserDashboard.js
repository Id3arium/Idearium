import '@/app/styles.css';
import { SignOutButton } from '@clerk/nextjs';
import { userAtom } from '@/lib/utils/atoms.js';
import { useAtomValue } from 'jotai';
export default function UserDashboard() {
    const user = useAtomValue(userAtom);

    return (
        <div id="user-dashboard" className="bg-blue h-200px w-600px p-4 rounded shadow-md border-2 border-white text-white">
            <div className="absolute m-auto top-0 right-0">
                <SignOutButton />
            </div>
            <p className="font-bold text-white">Name: {user?.fullName}</p>
            <p className="font-bold ">Email: {user?.primaryEmailAddress?.emailAddress}</p>
            <p className="font-bold text-white ">ID: {user?.id}</p>
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
