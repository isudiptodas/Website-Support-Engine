import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
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
  expiry?: string;
  options: { text: string, votes: number }[];
  dateCreated?: Date;
};

// type TimeLeft = {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// };

type optionInput = {
  text: string,
  votes: 0
}

type User = {
  _id?: string,
  name: string;
  email: string;
  password: string;
};

function Home() {

  const [votingData, setVotingData] = useState<Voting[] | null>(null);
  const [filteredData, setFilteredData] = useState<Voting[] | null>(null);
  const [currentData, setCurrentData] = useState<Voting | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [votingPopupVisible, setVotingPopupVisible] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [addingCampaign, setAddingCampaign] = useState(false);
  const [newCampaignVisible, setNewCampaignVisible] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [input, setInput] = useState('');
  const [now, setNow] = useState<Date>(new Date());
  const [isActive, setIsActive] = useState(false);

  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [expiry, setExpiry] = useState('');
  const [category, setCategory] = useState('');
  const [optionNumber, setOptionNumber] = useState(2);
  const [allCategory, setAllCategory] = useState<string[] | null>(null);
  const [options, setOptions] = useState<optionInput[]>(Array(optionNumber).fill({ text: "", votes: 0 }));

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

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeLeft = (expiry: string) => {
    const end = new Date(`${expiry}T23:59:59`);
    const left = end.getTime() - now.getTime();

    if (left <= 0) return null;

    return {
      days: Math.floor(left / (1000 * 60 * 60 * 24)),
      hours: Math.floor((left / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((left / (1000 * 60)) % 60),
      seconds: Math.floor((left / 1000) % 60)
    };
  }

  const pad = (n: number) => String(n).padStart(2, "0");

  useEffect(() => {
    const filtered = votingData?.filter((item) => {
      return item.title.includes(input) || item.source.includes(input);
    });

    if (filtered) {
      setFilteredData(filtered);
    }
  }, [input]);

  const submitCampaign = async () => {
    if (addingCampaign) return;

    if (!title || !source || !expiry) {
      toast.error("Empty fields not allowed");
      return;
    }

    if (options.length !== optionNumber) {
      toast.error("Add proper options");
      return;
    }
    setAddingCampaign(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/create-campaign`, {
        title: title.trim(), source: source.trim(), options, expiry, category
      }, { withCredentials: true });

      if (res.status === 200) {
        toast.success("Campaign added");
      }

    } catch (err: any) {
      if (err && err.response.data.message) {
        toast.error(err.response.data.message);
      }
      else {
        toast.error("Something went wrong");
      }
    }
    finally {
      setAddingCampaign(false);
      setNewCampaignVisible(false);
      setTitle('');
      setCategory('');
      setSource('');
      setExpiry('');
    }
  }

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], text };
    setOptions(newOptions);
  }

  useEffect(() => {
    const tempCategory = votingData?.map((item) => {
      return item.category
    });

    if (tempCategory) {
      setAllCategory(tempCategory);
    }
  }, [votingData]);

  return (
    <>
      <div className={`w-full min-h-screen bg-linear-to-b from-zinc-800 to-zinc-950 flex flex-col justify-start items-center relative overflow-y-auto hide-scrollbar`}>

        <Link to='/' className={`w-full cursor-pointer select-none fixed top-0 z-40 text-center py-5 backdrop-blur-3xl bg-white/5 border-b-2 border-b-black text-sm md:text-lg font-light`}>CloudVault</Link>

        <h1 className={`w-full text-center mt-24 md:mt-28 text-2xl md:text-4xl font-semibold`}>Ongoing Campaigns</h1>

        {/* voting popup */}
        <div onClick={() => setVotingPopupVisible(false)} className={`w-full ${votingPopupVisible ? "translate-y-0" : "translate-y-full"} duration-500 ease-in-out h-screen fixed top-0 backdrop-blur-2xl bg-black/70 z-40 flex flex-col justify-center items-center`}>
          <div onClick={(e) => e.stopPropagation()} className={`w-[95%] md:w-[60%] lg:w-[50%] xl:w-[40%] h-auto flex flex-col justify-start items-center`}>
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

        {/* new campaign popup */}
        <div onClick={() => setNewCampaignVisible(false)} className={`w-full ${newCampaignVisible ? "translate-y-0" : "translate-y-full"} duration-500 ease-in-out h-screen fixed top-0 backdrop-blur-2xl bg-black/70 z-40 flex flex-col justify-center items-center`}>
          <div onClick={(e) => e.stopPropagation()} className={`w-[95%] md:w-[60%] lg:w-[50%] xl:w-[40%] h-auto flex flex-col justify-start items-center`}>

            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add a campaign title" type="text" className={`w-[80%] py-3 px-3 outline-none text-white text-sm bg-gray-800`} />
            <div className={`w-[80%] mt-2 flex justify-start items-center gap-3`}>
              <span onClick={() => setOptionNumber(2)} className={`w-auto cursor-pointer text-[12px] px-3 py-2 border-2 ${optionNumber === 2 ? "text-white bg-zinc-800 border-blue-600" : "border-transparent bg-zinc-800"}`}>2 options</span>
              <span onClick={() => setOptionNumber(4)} className={`w-auto cursor-pointer text-[12px] px-3 py-2 border-2 ${optionNumber === 4 ? "text-white bg-zinc-800 border-blue-600" : "border-transparent bg-zinc-800"}`}>4 options</span>
            </div>

            <div className={`w-[80%] mt-5 flex flex-col justify-start items-center gap-3`}>
              {
                Array.from({ length: optionNumber }).map((_, index) => {
                  return <input onChange={(e) => handleOptionChange(index, e.target.value)} key={index} className={`w-full outline-none text-white text-sm bg-gray-800 px-3 py-2`} placeholder={`Enter option ${index + 1}`} />
                })
              }
            </div>
            <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Add a source name" type="text" className={`w-[80%] mt-3 py-3 px-3 outline-none text-white text-sm bg-gray-800`} />
            <input value={category} onFocus={() => setIsActive(true)} onChange={(e) => setCategory(e.target.value)} type='text' className={`w-[80%] py-2 px-3 bg-gray-800 text-white my-3 outline-none text-start text-sm`} placeholder="Select or add a category" />
            <div className={`w-[80%] ${isActive ? "block" : "hidden"} flex flex-col justify-start items-start max-h-[30vh] bg-zinc-800 overflow-y-auto hide-scrollbar`}>
              {
                isActive && allCategory?.map((item, index) => {
                  return <span onClick={() => { setCategory(item); setIsActive(false) }} key={index} className={`px-3 py-2 capitalize text-sm cursor-pointer hover:bg-zinc-700 duration-150 ease-in-out`}>{item}</span>
                })
              }
            </div>
            <div className={`w-[80%] mt-3 flex justify-center items-start h-auto`}>
              <input onChange={(e) => { setExpiry(e.target.value) }} type='date' className={`w-full bg-gray-800 px-3 py-2`} />
            </div>

            <p onClick={submitCampaign} className={`w-[80%] text-center mt-5 py-3 bg-linear-to-b from-blue-400 via-blue-500 to-blue-900 flex justify-center items-center gap-2`}>{addingCampaign ? (<>Adding campaign <span className={`loading loading-spinner loading-sm ${addingCampaign ? "block" : "hidden"}`}></span></>) : ("Add campaign")}</p>
          </div>
        </div>

        <div className={`w-full lg:w-[60%] xl:w-[40%] px-5 mt-7 flex flex-col justify-start items-center`}>
          <input onChange={(e) => setInput(e.target.value)} placeholder="Search campaign" type="text" className={`w-full py-3 px-3 outline-none text-white text-sm bg-zinc-950`} />
          <p onClick={() => setNewCampaignVisible(true)} className={`select-none w-full mt-2 text-center active:scale-95 duration-150 ease-in-out cursor-pointer text-sm py-2 bg-linear-to-br from-blue-400 via-blue-600 to-blue-500`}>Add campaign</p>
        </div>

        <div className={`w-full ${input ? "hidden" : "block"} z-30 px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-5`}>
          {votingData && votingData.slice().reverse().map((item, index) => {
            const left = timeLeft(item.expiry as string);
            return <div key={index} className={`w-full hover:rounded-3xl duration-200 ease-in-out cursor-pointer group flex flex-col justify-start items-start backdrop-blur-md bg-black/30 px-3 py-3`}>
              <p className={`w-auto text-[8px] capitalize px-4 py-1 rounded-full bg-zinc-900`}>{item.category}</p>
              <p className={`w-auto text-sm font-semibold capitalize px-2 py-5`}>{item.title}</p>
              <p className={`w-full text-start text-[12px] px-3 font-mono pb-3 text-green-400`}>{left ? (
                <span>
                  {left.days}d{" "}
                  {pad(left.hours)}:
                  {pad(left.minutes)}:
                  {pad(left.seconds)}
                </span>
              ) : (
                <span className={`w-full text-start text-[12px] px-3 font-mono pb-3 text-red-500`}>Expired</span>
              )}</p>
              <div className={`w-full ${item.voterEmail.includes(userData?.email as string) ? "hidden" : "block"} flex justify-between items-center py-2 px-3`}>
                <div className={`w-[10%] group-hover:w-[30%] duration-300 ease-in-out flex justify-center items-center`}> <span className={`w-full h-px bg-white`}></span> <span><IoIosArrowForward /></span></div>
                <p onClick={() => { setCurrentData(item); setVotingPopupVisible(true) }} className={`w-auto  px-6 cursor-pointer active:opacity-80 duration-200 ease-in-out py-1 rounded-full bg-white text-black text-[12px]`}>Vote</p>
              </div>
              <p className={`w-full text-center ${item.voterEmail.includes(userData?.email as string) ? "block" : "hidden"} text-[12px] opacity-70 italic py-3`}>You have already voted</p>
            </div>
          })}
        </div>

        {/* filtered data */}

        <div className={`w-full ${input ? "block" : "hidden"} z-30 px-4 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-5`}>
          {filteredData && filteredData.map((item, index) => {
            const left = timeLeft(item.expiry as string);
            return <div key={index} className={`w-full hover:rounded-3xl duration-200 ease-in-out cursor-pointer group flex flex-col justify-start items-start backdrop-blur-md bg-black/30 px-3 py-3`}>
              <p className={`w-auto text-[8px] capitalize px-4 py-1 rounded-full bg-zinc-900`}>{item.category}</p>
              <p className={`w-auto text-sm font-semibold capitalize px-2 py-5`}>{item.title}</p>
              <p className={`w-full text-start text-[12px] px-3 font-mono pb-3 text-green-400`}>{left ? (
                <span>
                  {left.days}d{" "}
                  {pad(left.hours)}:
                  {pad(left.minutes)}:
                  {pad(left.seconds)}
                </span>
              ) : (
                <span className={`w-full text-start text-[12px] px-3 font-mono pb-3 text-red-500`}>Expired</span>
              )}</p>
              <div className={`w-full ${item.voterEmail.includes(userData?.email as string) ? "hidden" : "block"} flex justify-between items-center py-2 px-3`}>
                <div className={`w-[10%] group-hover:w-[30%] duration-300 ease-in-out flex justify-center items-center`}> <span className={`w-full h-px bg-white`}></span> <span><IoIosArrowForward /></span></div>
                <p onClick={() => { setCurrentData(item); setVotingPopupVisible(true) }} className={`w-auto  px-6 cursor-pointer active:opacity-80 duration-200 ease-in-out py-1 rounded-full bg-white text-black text-[12px]`}>Vote</p>
              </div>
              <p className={`w-full text-center ${item.voterEmail.includes(userData?.email as string) ? "block" : "hidden"} text-[12px] opacity-70 italic py-3`}>You have already voted</p>
            </div>
          })}
        </div>
      </div>
    </>
  )
}

export default Home
