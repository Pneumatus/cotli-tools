import { DateTime, Interval } from 'luxon';

function EventSchedule() {

    const EVENT_SCHEDULE = [
        { name: 'Carnival Of Sorrows', month: 10, day: 13 },
        { name: 'Emo\'s New Moon', month: 10, day: 27 },
        { name: 'Kaines\' Dinner of Doom', month: 11, day: 17 },
        { name: 'The Nate Before Christmas', month: 12, day: 14 },
        { name: 'Princess\' Pool Party', month: 1, day: 6 },
        { name: 'The Carnage Cup', month: 1, day: 27 },
        { name: 'Merci\'s Mix Up', month: 2, day: 10 },
        { name: 'Hermit\'s Premature Party', month: 3, day: 4 },
        { name: 'Nate\'s Candy Conundrum', month: 4, day: 7 },
        { name: 'Superhero Spring', month: 4, day: 28 },
        { name: 'Gardeners of the Galaxy', month: 5, day: 19 },
        { name: 'The Hidden Temple', month: 6, day: 9 },
        { name: 'Alien Invasion Day', month: 6, day: 30 },
        { name: 'The Song of Thrones', month: 7, day: 21 },
        { name: 'Littlefoot\'s Big Adventure', month: 8, day: 11 },
        { name: 'Dr. Evil\'s Summer Sabotage', month: 9, day: 1 },
        { name: 'Sasha\'s Schoolhouse Scourge', month: 9, day: 22 },
    ];

    const DATEFORMAT = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        weekday: 'short',
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short',
    };

    const getNextStart = (day: number, month: number) => {
        const canadaNow = DateTime.local({ zone: 'Canada/Pacific' });
        let canadaNext = DateTime.local(canadaNow.year, month, day, 12, { zone: 'Canada/Pacific' });
        if (canadaNow > canadaNext) {
            canadaNext = canadaNext.plus({ years: 1 });
        }
        return canadaNext;
    };

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const calculateSchedule = () => {
        const sortedEvents = EVENT_SCHEDULE.reduce((arr: any, e) => {
            arr.push({ name: e.name, nextStart: getNextStart(e.day, e.month) });
            return arr;
        }, []).sort((e1: any, e2: any) => e1.nextStart - e2.nextStart);
        return sortedEvents;
    };

    const upcomingSchedule = calculateSchedule();

    return (
        <div className='shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <p className='text-xl'>Event Schedule</p>
            <p>- Dates and times shown in your local timezone</p>
            <table className='table-auto border-separate border border-slate-400'>
                <thead>
                    <tr>
                        <th className='border border-slate-300 px-2'>Event Name</th>
                        <th className='border border-slate-300 px-2'>Next Start</th>
                    </tr>
                </thead>
                <tbody>
                    {upcomingSchedule && upcomingSchedule.map((event: any, index: number) => {
                        return (
                            <tr key={index}>
                                <td className='border border-slate-300 px-2'>{event.name}</td>
                                <td className='border border-slate-300 px-2'>{event.nextStart.setZone(tz).toLocaleString(DATEFORMAT)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default EventSchedule;
