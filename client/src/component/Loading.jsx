import React from 'react'

const Loading = () => {
    return (
        <div className='w-full h-screen bg-[#e0dafc]'>
            <div className='w-full flex justify-center'>
                <div>
                    <div className='bg-[#a7adfd] w-20 h-20 rounded-full justify-center flex items-center mt-64 relative overflow-hidden'>
                        <div className='bg-[#e0dafc] w-14 h-14 rounded-full z-20'>

                        </div>
                        <div className='absolute animate-spin'>
                            <div className='w-6 h-20 bottom-10 bg-[#fac3e3]'></div>
                            <div className='w-6 h-20 bottom-10 bg-transparent'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Loading