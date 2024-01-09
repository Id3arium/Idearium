import { useUser } from '@clerk/nextjs';
export default function UserDashboard() {
    const { isSignedIn, user } = useUser();
    if(!isSignedIn) {
        return null;
    }

    const name = user.fullName;
    const email = user.primaryEmailAddress.emailAddress;
    const id = user.id;

    return (
      <div className="bg-gray-200 p-2 rounded shadow-md">
        <p className="font-bold">Name: {name}</p>
        <p className="font-bold">Email: {email}</p>
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