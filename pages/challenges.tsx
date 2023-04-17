import { DateTime, DateTimeFormatOptions } from 'luxon';
import challengeData from '../data/challenges.json';

function Challenges() {

    const DATEFORMAT: DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    };

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const sortedChallenges = challengeData.sort((e1: any, e2: any) => {
        return e1.lastEnded - e2.lastEnded;
    });

    const nextChallengeCandidates = sortedChallenges.slice(0, 3);
    const otherChallenges = sortedChallenges.slice(3);

    return (
        <div className='flex flex-wrap px-8 pt-6 pb-8 mb-4 h-0'>
            <div className='w-full pb-4'>
                <p className='text-xl'>Upcoming Challenges</p>
                <p>- Dates and times shown in your local timezone</p>
            </div>
            <div className='w-full lg:w-1/2 pb-4'>
                <p>Next Challenge Candidates</p>
                <table className='table-auto border-separate border border-slate-400'>
                    <thead>
                        <tr>
                            <th className='border border-slate-300 px-2'>Challenge Name</th>
                            <th className='border border-slate-300 px-2'>Last Ended</th>
                        </tr>
                    </thead>
                    <tbody>
                        {nextChallengeCandidates.map((challenge: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td className='border border-slate-300 px-2'>{challenge.name}</td>
                                    <td className='border border-slate-300 px-2'>{DateTime.fromSeconds(challenge.lastEnded).setZone(tz).toLocaleString(DATEFORMAT)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
            <div className='w-full lg:w-1/2'>
                <p>Other Challenges</p>
                <table className='table-auto border-separate border border-slate-400'>
                    <thead>
                        <tr>
                            <th className='border border-slate-300 px-2'>Challenge Name</th>
                            <th className='border border-slate-300 px-2'>Last Ended</th>
                        </tr>
                    </thead>
                    <tbody>
                        {otherChallenges.map((challenge: any, index: number) => {
                            return (
                                <tr key={index}>
                                    <td className='border border-slate-300 px-2'>{challenge.name}</td>
                                    <td className='border border-slate-300 px-2'>{DateTime.fromSeconds(challenge.lastEnded).setZone(tz).toLocaleString(DATEFORMAT)}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Challenges;
