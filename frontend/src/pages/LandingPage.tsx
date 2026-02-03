import axios from "axios";
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { IoIosArrowForward } from "react-icons/io";

type Voting = {
  category: string;
  title: string;
  source: string;
  optionNumber: number;
  userEmail?: string;
  option: {text: string, votes: number}[];
  dateCreated?: Date;
};

function LandingPage() {

  const [votingData, setVotingData] = useState<Voting[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/get-voting-list`);
        setVotingData(res.data.data);
      } catch (err) {
        console.log(`Error -> `, err);
      }
    }

    fetchList();
  }, []);

  return (
    <>
      <div className={`w-full h-screen flex flex-col justify-start items-center relative bg-linear-to-b from-zinc-800 to-zinc-950 overflow-y-auto hide-scrollbar`}>

        <h1 className={`w-full mt-5 z-20 text-center px-5 text-5xl md:text-7xl pt-5 lg:pt-0 pb-3 font-bold bg-linear-to-b from-white via-gray-400 to-gray-700 bg-clip-text text-transparent`}>Cloud Voting System</h1>
        <p className={`w-full md:w-[70%] z-20 text-center text-white text-sm md:text-lg opacity-70 font-light py-5 px-5`}>You can cast a vote after verifying your account</p>

        <div className={`w-125 h-125 bg-linear-to-br from-gray-500 to-black rounded-full opacity-30 absolute -left-1/2 -top-[20%] md:top-[10%] md:left-[20%] lg:-left-1/3 z-10`} />
        <div className={`w-125 h-125 bg-linear-to-br from-gray-600 to-black rounded-full opacity-15 absolute -right-1/2 -bottom-[20%] lg:bottom-[20%] lg:-right-[30%] z-10`} />

        <Link to='/auth/register' className={`w-auto px-5 py-2 rounded bg-white text-black text-center select-none z-20 cursor-pointer active:opacity-80 duration-150 ease-in-out`}>Get Started</Link>

        <div className={`w-full z-30 px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5`}>
          {votingData && votingData.map((item, index) => {
            return <div key={index} className={`w-full cursor-pointer group flex flex-col justify-start items-start backdrop-blur-md bg-black/30 px-3 py-3`}>
              <p className={`w-auto text-[8px] capitalize px-4 py-1 rounded-full bg-zinc-900`}>{item.category}</p>
              <p className={`w-auto text-sm font-semibold capitalize px-2 py-5`}>{item.title}</p>
              <div className={`w-full flex justify-between items-center py-2 px-3`}>
                <div className={`w-[10%] group-hover:w-[30%] duration-300 ease-in-out flex justify-center items-center`}> <span className={`w-full h-px bg-white`}></span> <span><IoIosArrowForward /></span></div>
                <p onClick={() => navigate('/user/home')} className={`w-auto px-6 cursor-pointer active:opacity-80 duration-200 ease-in-out py-1 rounded-full bg-white text-black text-[12px]`}>Vote</p>
              </div>
            </div>
          })}
        </div>

      </div>
    </>
  )
}

export default LandingPage
