import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { GetcurrentRequest, updateNewRequest } from '../../Reducers/userSlice';
import { useSocket } from '../../SocketContext';

const FriendNotify = () => {
    const dispatch = useDispatch()
    const { socket } = useSocket()
    const token = useSelector(state => state.auth.token)
    const currentRequest = useSelector(state => state.user.currentRequest)

    useEffect(() => {
        const FetchData = async () => {
            await dispatch(GetcurrentRequest(token))
        }
        FetchData()
    }, [dispatch])


    useEffect(() => {
        if (socket) {
            const handleNewRequest = (data) => {
                dispatch(updateNewRequest(data));
            };


            socket.on('newRequest', handleNewRequest);

            // Cleanup function to unsubscribe when token changes or on component unmount
            return () => {
                socket.off('newRequest', handleNewRequest); // Remove only the handler for 'newRequest'
            };
        }
    }, [token])


    return (
        <div className='relative'>
            <button className="bg-[#e7b9b9] p-2.5 rounded-full">
                <PeopleAltIcon size={25} className='text-white' />
            </button>
            {
                currentRequest.length > 0
                &&
                <div className='absolute w-6 h-6 bg-red-600 rounded-full left-[-5px] top-[-1px] text-[12px] flex items-center justify-center p-2.5 font-bold text-white animate-bounce'>{currentRequest.length}</div>
            }

        </div>
    )
}

export default FriendNotify