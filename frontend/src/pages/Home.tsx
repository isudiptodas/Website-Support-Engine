import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoIosArrowForward } from "react-icons/io";

type Voting = {
  _id?: string,
  category: string;
  title: string;
  source: string;
  voterEmail: string[],
  optionNumber: number;
  userEmail?: string;
  options: { text: string, votes: number }[];
  dateCreated?: Date;
};

type User = {
  _id?: string,
  name: string;
  email: string;
  password: string;
};

function Home() {

  const [votingData, setVotingData] = useState<Voting[] | null>(null);
  const [currentData, setCurrentData] = useState<Voting | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [votingPopupVisible, setVotingPopupVisible] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user-verify`, {
          withCredentials: true
        });
        setUserData(res.data.data);
      } catch (err) {
        console.log(`Error -> `, err);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (votingPopupVisible) {
      document.body.style.overflow = 'hiddden';
    }
    else {
      document.body.style.overflow = 'auto';
    }
  }, [votingPopupVisible]);

  const submitVote = async () => {
    if (!selectedAnswer) return;
    setSubmittingVote(true);
    try {
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/cast-vote`, {
        campaignID: currentData?._id, answer: selectedAnswer
      }, {
        withCredentials: true
      });

      console.log(res);
    } catch (err: any) {
      if (err && err.response.data.message) {
        toast.error(err.response.data.message);
      }
      else {
        toast.error("Something went wrong");
      }
    }
    finally {
      setSubmittingVote(false);
    }
  }

  return (
    <>
      <div className={`w-full min-h-screen bg-linear-to-b from-zinc-800 to-zinc-950 flex flex-col justify-start items-center relative overflow-y-auto hide-scrollbar`}>
        <h1 className={`w-full text-center mt-10 text-2xl md:text-4xl font-semibold`}>Ongoing Campaigns</h1>

        {/* voting popup */}
        <div onClick={() => setVotingPopupVisible(false)} className={`w-full ${votingPopupVisible ? "translate-y-0" : "translate-y-full"} duration-500 ease-in-out h-screen fixed top-0 backdrop-blur-2xl bg-black/70 z-40 flex flex-col justify-center items-center`}>
          <div className={`w-[95%] md:w-[60%] lg:w-[50%] xl:w-[40%] h-auto flex flex-col justify-start items-center`}>
            <p className={`w-auto mb-4 px-4 py-1 capitalize text-[12px] rounded-full bg-zinc-800`}>{currentData?.category}</p>
            <h1 className={`w-full px-4 font-semibold text-2xl text-center`}>{currentData?.title}</h1>

            <div onClick={(e) => e.stopPropagation()} className={`w-[80%] mt-5 grid grid-cols-1 md:grid-cols-2 justify-items-center gap-3`}>
              {currentData?.options?.map((opt, index) => {
                return <p key={index} onClick={() => setSelectedAnswer(opt.text)} className={`w-full select-none cursor-pointer ${selectedAnswer === opt.text ? "text-black bg-white" : "text-white bg-transparent"} text-start py-3 px-3 border border-zinc-600`}>{opt.text}</p>
              })}
            </div>

            <p onClick={submitVote} className={`w-[80%] text-center mt-5 py-3 bg-linear-to-b from-blue-400 via-blue-500 to-blue-900 flex justify-center items-center gap-2`}>{submittingVote ? (<>Submitting vote <span className={`loading loading-spinner loading-sm ${submittingVote ? "block" : "hidden"}`}></span></>) : ("Submit vote")}</p>
          </div>
        </div>

        <div className={`w-full z-30 px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-5`}>
          {votingData && votingData.map((item, index) => {
            return <div key={index} className={`w-full cursor-pointer group flex flex-col justify-start items-start backdrop-blur-md bg-black/30 px-3 py-3`}>
              <p className={`w-auto text-[8px] capitalize px-4 py-1 rounded-full bg-zinc-900`}>{item.category}</p>
              <p className={`w-auto text-sm font-semibold capitalize px-2 py-5`}>{item.title}</p>
              <div className={`w-full ${item.voterEmail.includes(userData?.email as string) ? "hidden" : "block"} flex justify-between items-center py-2 px-3`}>
                <div className={`w-[10%] group-hover:w-[30%] duration-300 ease-in-out flex justify-center items-center`}> <span className={`w-full h-px bg-white`}></span> <span><IoIosArrowForward /></span></div>
                <p onClick={() => { setCurrentData(item); setVotingPopupVisible(true) }} className={`w-auto  px-6 cursor-pointer active:opacity-80 duration-200 ease-in-out py-1 rounded-full bg-white text-black text-[12px]`}>Vote</p>
              </div>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default Home
