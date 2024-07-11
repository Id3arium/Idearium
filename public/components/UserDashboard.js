import '@/app/styles.css';
import { SignOutButton } from '@clerk/nextjs';
import { userAtom } from '@/lib/utils/atoms.js';
import { useAtomValue } from 'jotai';
export default function UserDashboard() {
    const user = useAtomValue(userAtom);

    function maskEmail(email)
    {
        if (typeof email !== 'string') {
            return '...';
        }
        const [localPart, domain] = email.split('@');
        let maskedLocal;
        if (localPart.length <= 2) {
            maskedLocal = '*'.repeat(localPart.length);
        } else {
            maskedLocal = localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1];
        }
        return `${maskedLocal}@${domain}`;
    }

    return (
        <div
            id="user-dashboard"
            className=" text-[#EEE] ml-3 mr-1 my-5 p-3 bg-clear rounded-md shadow-[0_0_6px_#CCC] backdrop-blur-md"
        >
           
            <div
                className="absolute p-1.5 border-[1px] border-clear text-[#CCC] rounded-md top-2 right-2 bg-[#444] hover:bg-[#666] hover:text-[#EEE] hover:border-[#AAA]"
            >
                <SignOutButton> Sign out </SignOutButton>
            </div>
            <p className="" >Name: {user?.fullName}</p>
            <p className="" >Email: {maskEmail(user?.primaryEmailAddress?.emailAddress)}</p>
            <p className="" >ID: {user?.id}</p>
            <div>
                <h2 className=" mt-4">Your Constellations:</h2>
                {/* <ul>
                    {constellations.map((constellation, index) => (
                        <li key={index}>{constellation}</li>
                    ))}
                </ul> */}
            </div>
        </div>
    );
}
