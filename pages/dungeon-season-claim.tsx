import Link from 'next/link';
import { useState, useEffect } from 'react';
import GridLoader from 'react-spinners/GridLoader';
import pluralize from 'pluralize';

function DungeonSeasonClaim() {
    const [data, setData] = useState<any>(null);
    const [claimRes, setClaimRes] = useState<string[]>([]);
    const [user, setUser] = useState(false);
    const [loading, setLoading] = useState<string>('');
    const [error, setError] = useState<any>(null);

    const [userId, setUserId] = useState<string>('');
    const [hash, setHash] = useState<string>('');

    const [playServer, setPlayServer] = useState<string>('https://idlemaster.djartsgames.ca/~idle/');
    const [instanceId, setInstanceId] = useState<any>(null);

    useEffect(() => {
        const savedUserId = localStorage.getItem('userId');
        const savedHash = localStorage.getItem('hash');

        if (savedUserId && savedHash) {
            setUserId(savedUserId);
            setHash(savedHash);
            setUser(true);
        }
    }, []);

    const gemDefines: Record<string, string> = {
        '1': 'Fire Rune',
        '2': 'Water Rune',
        '3': 'Air Rune',
        '4': 'Earth Rune',
        '5': 'Soul Rune'
    }

    const chestDefines: Record<string, string> = {
        '365': 'Runic Chest',
        '516': 'Runic Grab Bag'
    }

    const craftingMaterialDefines: Record<string, string> = {
        '5': 'Legendary Catalyst'
    }

    const describe = (rewardDefs: any) => {
        const rewardStrings = [];
        for (const rewardDef of rewardDefs) {
            switch (rewardDef.reward) {
                case 'gems':
                case 'chest':
                    rewardStrings.push(`${rewardDef.count} x ${pluralize(describeType(rewardDef), rewardDef.count)}`);
                    break;
                case 'sunset_tickets':
                case 'red_rubies':
                case 'crafting_materials':
                case 'challenge_tokens':
                case 'dungeon_coins':
                case 'dungeon_vouchers':
                case 'epic_recipe_tokens':
                    rewardStrings.push(`${rewardDef.amount} x ${pluralize(describeType(rewardDef), rewardDef.amount)}`);
                    break;
                case 'season_buff':
                    rewardStrings.push(describeType(rewardDef));
                    break;
                default: rewardStrings.push(JSON.stringify(rewardDef));
            }
        }
        return rewardStrings.join(', ');
    };

    const describeEffect = (effectString: string) => {
        const parts = effectString.split(',');
        switch (parts[0]) {
            case 'bonus_idols_earned_from_reset':
                return `+${parts[1]}% Idols`;
            case 'increase_monster_spawn_time_mult':
                return `+${parts[1]}% Spawn Speed`;
            case 'dungeon_progress_mult':
                return `+${parts[1]}% Dungeon Points`;
            default:
                return effectString;
        }
    }

    const describeType = (rewardDef: any) => {
        switch (rewardDef.reward) {
            case 'gems': return `Level ${rewardDef.level} ` + gemDefines[rewardDef.id] || `Unmapped Rune Id ${rewardDef.id}`;
            case 'chest': return chestDefines[rewardDef.chest_type_id] || `Unmapped Chest Id ${rewardDef.chest_type_id}`;
            case 'sunset_tickets': return 'Sunset Ticket';
            case 'red_rubies': return 'Red Ruby';
            case 'challenge_tokens': return 'Challenge Token';
            case 'dungeon_coins': return 'Dungeon Coin';
            case 'dungeon_vouchers': return 'Dungeon Voucher';
            case 'epic_recipe_tokens': return 'Epic Recipe Token';
            case 'crafting_materials': return craftingMaterialDefines[rewardDef.crafting_material_id] || `Unmapped Crafting Material Id ${rewardDef.crafting_material_id}`;
            case 'season_buff': return `Season Buff: ${describeEffect(rewardDef.effect.effect_string)}`;
            default: return JSON.stringify(rewardDef);
        }
    }

    const makeApiCall = async (args: Record<string, string>): Promise<any> => {
        const qs = new URLSearchParams(args).toString();
        let reqUrl = `${playServer}post.php?${qs}`;
        let response = await fetch(reqUrl, {
            method: 'GET',
        });
        let data = await response.json();
        if (!data.switch_play_server) {
            return data;
        }

        // Switch and retry
        setPlayServer(data.switch_play_server);
        reqUrl = `${playServer}post.php?${qs}`;
        response = await fetch(reqUrl, {
            method: 'GET',
        });
        data = await response.json();
        return data;
    }

    const checkUnclaimed = async () => {
        // Clear existing state
        setError(null);
        setData(null);

        try {
            setLoading('Fetching userdata');
            const data = await makeApiCall({
                call: 'getUserDetails',
                user_id: userId,
                hash: hash,
                instance_key: '0'
            });
            setInstanceId(data.details.instance_id);

            setLoading('Checking for unclaimed rewards');

            const season = data.details.seasons[7];

            const unclaimedData: Record<string, any> = {
                has_pass: season.user_data.has_pass === '1',
                by_level: {},
                by_reward: {},
            };

            // First deal with non-repating
            for (let i = 0; i < season.def.details.collapse_rewards.start_at; i++) {
                const defLevel = season.def.levels[i];
                if (parseInt(defLevel.points_required) > season.user_data.points) {
                    break; // No point going further
                }
                if (!season.user_data.claimed_base.includes(i)) {
                    const l = unclaimedData.by_level[i] || {}
                    l.base_rewards = describe(defLevel.base_rewards);
                    unclaimedData.by_level[i] = l;
                    for (const br of defLevel.base_rewards) {
                        let qty = unclaimedData.by_reward[describeType(br)] || 0
                        qty += br.count || br.amount || 1;
                        unclaimedData.by_reward[describeType(br)] = qty;
                    }
                }
                if (season.user_data.has_pass === '1' && !season.user_data.claimed_bonus.includes(i)) {
                    const l = unclaimedData.by_level[i] || {}
                    l.bonus_rewards = describe(defLevel.bonus_rewards);
                    unclaimedData.by_level[i] = l;
                    for (const br of defLevel.bonus_rewards) {
                        let qty = unclaimedData.by_reward[describeType(br)] || 0
                        qty += br.count || br.amount || 1;
                        unclaimedData.by_reward[describeType(br)] = qty;
                    }
                }
            }

            const repeatingLevels = season.def.levels.slice(season.def.details.collapse_rewards.start_at);
            const startingPointsReq = parseInt(season.def.levels[season.def.details.collapse_rewards.start_at - 1].points_required);
            for (let i = 0; i < repeatingLevels.length; i++) {
                if (i === 0) {
                    repeatingLevels[i].points_diff = parseInt(repeatingLevels[i].points_required) - startingPointsReq;
                } else {
                    repeatingLevels[i].points_diff = parseInt(repeatingLevels[i].points_required) - parseInt(repeatingLevels[i - 1].points_required);
                }
            }
            let pointsRemaining = parseInt(season.user_data.points) - startingPointsReq;
            let repeatCount = 1;
            while (pointsRemaining > 0) {
                for (let i = 0; i < repeatingLevels.length; i++) {
                    pointsRemaining -= repeatingLevels[i].points_diff;
                    if (pointsRemaining <= 0) {
                        break;
                    }
                    const effectiveLevel = i + 1 + (repeatCount * 50);
                    if (!season.user_data.claimed_base.includes(effectiveLevel)) {
                        const l = unclaimedData.by_level[effectiveLevel] || {}
                        l.base_rewards = describe(repeatingLevels[i].base_rewards);
                        unclaimedData.by_level[effectiveLevel] = l;
                        for (const br of repeatingLevels[i].base_rewards) {
                            let qty = unclaimedData.by_reward[describeType(br)] || 0
                            qty += br.count || br.amount;
                            unclaimedData.by_reward[describeType(br)] = qty;
                        }
                    }
                    if (season.user_data.has_pass === '1' && !season.user_data.claimed_bonus.includes(effectiveLevel)) {
                        const l = unclaimedData.by_level[effectiveLevel] || {}
                        l.bonus_rewards = describe(repeatingLevels[i].bonus_rewards);
                        unclaimedData.by_level[effectiveLevel] = l;
                        for (const br of repeatingLevels[i].bonus_rewards) {
                            let qty = unclaimedData.by_reward[describeType(br)] || 0
                            qty += br.count || br.amount;
                            unclaimedData.by_reward[describeType(br)] = qty;
                        }
                    }
                }
                repeatCount++;
            }

            setData(unclaimedData);
            setLoading('');
        } catch (error) {
            setError(error);
            setLoading('');
        }
    };

    const claim = async (level: string, bonus: boolean) => {
        // Clear existing state
        setError(null);
        setData(null);

        try {
            setLoading('Claiming rewards');
            const claimRespData = await makeApiCall({
                call: 'claimseasonreward',
                user_id: userId,
                hash: hash,
                instance_id: instanceId,
                season_id: '7',
                level: level,
                is_bonus: bonus ? '1' : '0'
            });

            setLoading('Parsing rewards');

            const claimResLines: string[] = [];
            Object.keys(claimRespData.rewards).forEach(rewardKey => {
                switch (rewardKey) {
                    case 'gems': {
                        const gemCounts: Record<string, number> = {};
                        for (const gem of claimRespData.rewards[rewardKey]) {
                            const name = `Level ${gem.level} ` + gemDefines[gem.id] || `Unmapped Rune Id ${gem.id}`;
                            let count = gemCounts[name] || 0;
                            count += gem.count;
                            gemCounts[name] = count;
                        }
                        Object.keys(gemCounts).forEach(name => {
                            const qty = gemCounts[name];
                            claimResLines.push(`${qty} x ${pluralize(name, qty)}`);
                        })
                        break;
                    }
                    case 'crafting_materials': {
                        Object.keys(claimRespData.rewards[rewardKey]).forEach(id => {
                            const qty = claimRespData.rewards[rewardKey][id];
                            const name = craftingMaterialDefines[id] || `Unmapped Crafting Material Id ${id}`;
                            claimResLines.push(`${qty} x ${pluralize(name, qty)}`);
                        });
                        break;
                    }
                    case 'sunset_tickets':
                    case 'challenge_tokens':
                    case 'dungeon_coins':
                    case 'dungeon_vouchers':
                    case 'epic_recipe_tokens':
                        const qty = claimRespData.rewards[rewardKey];
                        const name = describeType({ reward: rewardKey });
                        claimResLines.push(`${qty} x ${pluralize(name, qty)}`);
                        break;
                    case 'chests': {
                        Object.keys(claimRespData.rewards[rewardKey]).forEach(id => {
                            const qty = claimRespData.rewards[rewardKey][id];
                            const before = claimRespData.rewards['chest_changes'][id].before;
                            const after = claimRespData.rewards['chest_changes'][id].after;
                            const name = chestDefines[id] || `Unmapped Chest Id ${id}`;
                            claimResLines.push(`${qty} x ${pluralize(name, qty)} - Before: ${before}; After: ${after}`);
                        });
                        break;
                    }
                    case 'red_rubies': {
                        const qty = claimRespData.rewards[rewardKey];
                        const before = claimRespData.rewards['red_rubies_before'];
                        const after = claimRespData.rewards['total_red_rubies'];
                        claimResLines.push(`${qty} x ${pluralize('Red Ruby', qty)} - Before: ${before}; After: ${after}`);
                        break;
                    }
                    case 'chest_changes':
                    case 'red_rubies_before':
                    case 'total_red_rubies':
                    case 'graphic_id':
                        break;
                    default: claimResLines.push(`Unknown Reward: ${rewardKey} => ${JSON.stringify(claimRespData.rewards[rewardKey])}`);
                }
            });

            setClaimRes(claimResLines);
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
            {user && (!data || data.by_level && Object.keys(data.by_level).length === 0) && (
                <button onClick={checkUnclaimed} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Check Unclaimed</button>
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

            {data && data.by_level && Object.keys(data.by_level).length === 0 && (
                <p className='pt-4'>No unclaimed rewards...</p>
            )}

            {data && data.by_level && Object.keys(data.by_level).length > 0 && (
                <div className='flex flex-wrap'>
                    <div className='w-full lg:w-1/2 pb-4'>
                        <p className='text-xl'>Unclaimed By Level</p>
                        <table className='table-auto border-separate border border-slate-400'>
                            <thead>
                                <tr>
                                    <th className='border border-slate-300 px-2'>Level</th>
                                    <th className='border border-slate-300 px-2'>Base Reward</th>
                                    {data.has_pass && (
                                        <th className='border border-slate-300 px-2'>Pass Reward</th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(data.by_level).map(level => {
                                    return (
                                        <tr key={level}>
                                            <td className='border border-slate-300 px-2'>{level}</td>
                                            <td className='border border-slate-300 px-2'>{data.by_level[level].base_rewards || 'Already Claimed'}{data.by_level[level].base_rewards && <button onClick={() => claim(level, false)} className='float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.5 px-0.5 rounded focus:outline-none focus:shadow-outline'>Claim</button>}</td>
                                            {data.has_pass && <td className='border border-slate-300 px-2'>{data.by_level[level].bonus_rewards || 'Already Claimed'}{data.by_level[level].bonus_rewards && <button onClick={() => claim(level, true)} className='float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-0.5 px-0.5 rounded focus:outline-none focus:shadow-outline'>Claim</button>}</td>}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className='w-full lg:w-1/2 pb-4'>
                        <p className='text-xl'>Unclaimed By Reward</p>
                        <table className='table-auto border-separate border border-slate-400 w-full lg:w-1/2'>
                            <thead>
                                <tr>
                                    <th className='border border-slate-300 px-2'>Reward</th>
                                    <th className='border border-slate-300 px-2'>Qty</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.keys(data.by_reward).sort().map(name => {
                                    return (
                                        <tr key={name}>
                                            <td className='border border-slate-300 px-2'>{pluralize(name, data.by_reward[name])}</td>
                                            <td className='border border-slate-300 px-2'>{data.by_reward[name]}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        <div className='pt-5'></div>
                        <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 w-full lg:w-1/2' role='alert'>
                            <p className='font-bold'>Be Warned</p>
                            <p>This should work fine, but don&apos;t blame me if it doesn&apos;t! You may want to close your game before claiming just to be safe.</p>
                        </div>
                        <div className='pt-5'>
                            <button onClick={() => claim('all', false)} className='w-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Claim All</button>
                        </div>
                    </div>
                </div>
            )}
            {claimRes && claimRes.length > 0 && (
                <div className='pt-4'>
                    <p className='text-xl'>Last Claim Results</p>
                    <ul className='list-disc ml-8'>
                        {claimRes.map((line, index) => <li key={index}>{line}</li>)}
                    </ul>
                    <div className='pt-5'></div>
                    <div className='bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 w-1/2' role='alert'>
                        <p className='font-bold'>Don&apos;t Forget</p>
                        <p>If you didn&apos;t close your game before claiming, make sure you restart it now.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DungeonSeasonClaim;
