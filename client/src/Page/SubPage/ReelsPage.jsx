import { useRef, useState } from 'react';
import { ThumbsUp } from 'lucide-react';

const ReelsPage = () => {
    const [clicked, setClicked] = useState(false);
    const timeoutRef = useRef(null);
    const animationRef = useRef(null);  // ใช้สำหรับเก็บค่าของการรีเซ็ตแอนิเมชัน

    // ฟังก์ชันเพื่อสลับสถานะเมื่อคลิก
    const handleClick = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // เริ่มแอนิเมชัน
        setClicked(true);

        // รีเซ็ตสถานะหลังจากที่แอนิเมชันเสร็จสิ้น
        timeoutRef.current = setTimeout(() => {
            setClicked(false);
        }, 800); // 800ms ตามระยะเวลาแอนิเมชัน
    };

    // จับเหตุการณ์ animationend เพื่อให้แน่ใจว่าแอนิเมชันเสร็จสิ้นแล้ว
    const handleAnimationEnd = () => {
        // เมื่อแอนิเมชันเสร็จสิ้นจะรีเซ็ตสถานะ
        setClicked(false);
    };

    return (
        <div className='mt-10'>
            <div className=''>
                <button
                    onClick={handleClick}
                    className={`bg-purple-200 px-5 py-2 rounded-3xl`}
                >
                    <ThumbsUp
                        className={`text-[#a7b0fc] ${clicked ? 'animate-expand' : ''}`}
                        onAnimationEnd={handleAnimationEnd} // เมื่อแอนิเมชันเสร็จสิ้น
                    />
                </button>
            </div>
        </div>
    );
};

export default ReelsPage;
