import { useState, useEffect } from 'react';

function UserSettings() {
    const [userId, setUserId] = useState<string>('');
    const [hash, setHash] = useState<string>('');

    useEffect(() => {
        const savedUserId = localStorage.getItem('userId');
        const savedHash = localStorage.getItem('hash');

        if (savedUserId && savedHash) {
            setUserId(savedUserId);
            setHash(savedHash);
        }
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        localStorage.setItem('userId', userId);
        localStorage.setItem('hash', hash);
    };

    return (
        <div>
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
            <p className="font-bold">Information</p>
            <p className="text-sm">These settings are only stored in localStorage in your browser</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label htmlFor="userId" className="block text-gray-700 text-sm font-bold mb-2">User ID:</label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    id="userId"
                    value={userId}
                    onChange={(event) => setUserId(event.target.value)}
                />
            </div>
            <div className="mb-6">
                <label htmlFor="hash" className="block text-gray-700 text-sm font-bold mb-2">Hash:</label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="text"
                    id="hash"
                    value={hash}
                    onChange={(event) => setHash(event.target.value)}
                />
            </div>
            <div className="flex items-center justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save to Local Storage</button>
            </div>
        </form>
        </div>
    );
}

export default UserSettings;
