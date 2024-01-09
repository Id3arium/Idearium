function UserDashboard({ name, id, constellations }) {
    return (
      <div className="bg-gray-200 p-2 rounded shadow-md">
        <p className="font-bold">Name: {name}</p>
        <p className="font-bold">ID: {id}</p>
        <div>
          <h2 className="font-bold mt-4">Your Constellations:</h2>
          <ul>
            {constellations.map((constellation, index) => (
              <li key={index}>{constellation}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  }