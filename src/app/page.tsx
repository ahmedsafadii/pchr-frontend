import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex justify-between items-center container py-8">
        <div className="flex items-center gap-4">
          {/* Logo - replace src with actual logo path if available */}
          <Image
            src="/img/logo_en.svg"
            alt="PCHR Logo"
            width={218}
            height={93}
          />
        </div>
        <div className="flex gap-4">
          <button className="bg-gray-100 rounded-full px-6 py-2 font-semibold text-sm">
            Lawyer Login
          </button>
          <button className="bg-gray-100 rounded-full px-6 py-2 font-semibold text-sm">
            عربي
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch mt-8">
          <h1 className="flex-1 text-3xl md:text-4xl font-extrabold mb-2">
            Disappearance Report
            <br />
            Platform
          </h1>
          <p className="flex-1 text-gray-700 text-base md:text-lg text-right md:text-left">
            A digital platform dedicated to helping families in Gaza report
            missing persons during crises, wars, or disasters. It allows people
            to submit details, photos, and contact information securely.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch mt-8">
          {/* Report Card */}
          <div className="flex-1 bg-black bg-opacity-90 rounded-2xl p-8 flex flex-col justify-between min-w-[320px] max-w-xl shadow-lg relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              REPORT A MISSING OR DETAINED PERSON
            </h2>
            <p className="text-white text-base mb-8">
              A digital platform dedicated to helping families in Gaza report
              missing persons during crises, wars, or disasters. It allows
              people to submit details, photos, and contact information
              securely.
            </p>
            <button className="w-full bg-white text-black font-bold py-3 rounded-md text-base tracking-wider transition hover:bg-gray-200">
              REPORT NEW CASE
            </button>
          </div>
          {/* Track Card */}
          <div className="flex-1 bg-black bg-opacity-90 rounded-2xl p-8 flex flex-col justify-between min-w-[320px] max-w-xl shadow-lg relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
              CHECK CASE STATUS
            </h2>
            <p className="text-white text-base mb-8">
              A digital platform dedicated to helping families in Gaza report
              missing persons during crises, wars, or disasters. It allows
              people to submit details, photos, and contact information
              securely.
            </p>
            <button className="w-full bg-white text-black font-bold py-3 rounded-md text-base tracking-wider transition hover:bg-gray-200">
              TRACK NOW
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
