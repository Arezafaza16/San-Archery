import React, { useEffect, useRef } from 'react';


const AboutUs = () => {
    const sectionRef = useRef(null);
    const testimonialRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const section = sectionRef.current;
            const testimonial = testimonialRef.current;
            const sectionRect = section.getBoundingClientRect();

            if (sectionRect.top >= 0 && sectionRect.bottom <= window.innerHeight) {
                section.classList.remove('hidden');
                section.classList.add('slide-in-left');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div id='about' className=' w-full flex flex-col items-center md:my-20'>
            <h2 className=' font-bold text-[#bf8347] text-3xl lg:text-5xl my-10'>
                About
                <span className=' ml-2 text-white'>
                    Us
                </span>
            </h2>
            <div className=' w-full flex flex-col lg:flex-row gap-10 items-center lg:gap-16 p-4'>
                <div ref={sectionRef} className=' w-[400px] px-10 md:w-[800px] p-3 lg:mr-auto lg:mb-[500px] hiddenAbout'>
                    <h2 className=' text-4xl mb-5 text-white font-bold'>Kenapa Memilih Product Kami?</h2>
                    <p className=" text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    <p className=" text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    <p className=" text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    <p className=" text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                    <p className=" text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</p>
                </div>
            </div>
        </div>
    )
}

export default AboutUs