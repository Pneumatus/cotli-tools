import Link from 'next/link';
import { useState, useEffect } from 'react';
import GridLoader from 'react-spinners/GridLoader';

function TalentReset() {
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState<string>('');
    const [error, setError] = useState<any>(null);

    const [resetRes, setResetRes] = useState<any>();

    const [userId, setUserId] = useState<string>('');
    const [hash, setHash] = useState<string>('');

    useEffect(() => {
        const savedUserId = localStorage.getItem('userId');
        const savedHash = localStorage.getItem('hash');

        if (savedUserId && savedHash) {
            setUserId(savedUserId);
            setHash(savedHash);
            setUser(true);
        }
    }, []);

    const resetTalents = async () => {
        // Clear existing state
        setError(null);

        try {
            setLoading('Fetching current instance_id');
            // Get current instance_id
            const response = await fetch(`https://idlemaster.djartsgames.ca/~idle/post.php?call=getUserDetails&user_id=${userId}&hash=${hash}&instance_key=0`, {
                method: 'GET',
            });
            const data = await response.json();
            const instanceId = data.details.instance_id;

            setLoading('Resetting Talents');

            const resetResp = await fetch(`https://idlemaster.djartsgames.ca/~idle/post.php?call=respectalents&user_id=${userId}&hash=${hash}&instance_id=${instanceId}`, {
                method: 'GET',
            });

            const resetRespData = await resetResp.json();
            setResetRes(resetRespData.actions);
            setLoading('');
        } catch (error) {
            setError(error);
            setLoading('');
        }
    }

    return (
        <div className='px-8 pt-6 pb-8 mb-4'>
            {!user && (
                <Link href='/user-settings'>
                    <p>Configure User Settings first...</p>
                </Link>
            )}
            {user && !resetRes && (
                <div>
                    <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 w-full lg:w-1/2' role='alert'>
                        <p className='font-bold'>Be Warned</p>
                        <p>This will reset your talents in game<br />If you don't have free talent respecs it will reduce your idol count!</p>
                    </div>
                    <div className='pt-5'>
                        <button onClick={resetTalents} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Reset Talents</button>
                    </div>
                </div>
            )}

            {(loading) && (
                <div className='flex pt-4'>
                    <div className='shrink'>
                        <GridLoader color='purple' />
                    </div>
                    <div className='px-4'>
                        <p className='align-middle'>Loading... <br />{loading}</p>
                    </div>
                </div>
            )}

            {error && <p>Error: {error.message}</p>}

            {resetRes && (
                <pre>
                    {JSON.stringify(resetRes, undefined, 4)}
                </pre>
            )}
        </div>
    );
}

export default TalentReset;
