import axios from "axios"
import { useState } from "react"
import { toast } from "sonner";

function Home() {

  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/upload-file`, formData);
      console.log(res.data);

    } catch (err: any) {
      if (err && err.response.data.message) {
        toast.error(err.response.data.message);
      }
      else {
        toast.error("Something went wrong");
      }
    }
  }

  return (
    <>
      <div className={`w-full h-screen bg-white flex flex-col justify-start items-center relative overflow-hidden`}>
        <input
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              if (file.type !== "application/pdf") {
                toast.error("Only PDF files allowed");
                return;
              }

              if (file.size > 10 * 1024 * 1025) {
                toast.error("Maximum file size is 10MB");
                return;
              }

              setFile(file);
            }
          }} type="file" className="h-10 bg-teal-400" />

        <p onClick={uploadFile} className={`text-black`}>Upload</p>
      </div>
    </>
  )
}

export default Home
