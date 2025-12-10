import { FiBell, FiUser, FiGrid, FiChevronDown } from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#1a1333] text-white">
      <header className="bg-[#2d1f4d] px-8 py-4 flex justify-between items-center border-b-2 border-purple-500">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg"><FiGrid size={24} /></div>
          <span className="text-xl font-bold">Global-IPI-Platform</span>
        </div>
        <nav className="flex gap-8">
          <button className="border-b-2 border-purple-500 pb-1">Home</button>
          <button className="text-gray-300">IP Activity</button>
          <button className="text-gray-300">Profile</button>
        </nav>
        <div className="flex gap-4">
          <button className="bg-white/10 p-2 rounded-full"><FiBell size={20} /></button>
          <button className="bg-white/20 p-2 rounded-full"><FiUser size={20} /></button>
        </div>
      </header>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <button className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 rounded-lg flex items-center gap-2">
            <FiGrid /> Dashboard <FiChevronDown />
          </button>
        </div>

        <div className="bg-[#2d1f4d]/50 backdrop-blur rounded-2xl p-8 mb-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">IP Intelligence</h3>
              <div className="flex gap-4 text-sm mb-2">
                <span><span className="inline-block w-3 h-3 bg-blue-400 mr-1"></span>HP</span>
                <span><span className="inline-block w-3 h-3 bg-pink-500 mr-1"></span>Session</span>
              </div>
              <Bar data={{labels:["Jan","Fse","Wed","Thu","Fri","Sep"],datasets:[{label:"HP",backgroundColor:"#6b9fff",data:[35,22,25,35,30,48]},{label:"Session",backgroundColor:"#ff4f7b",data:[12,40,15,18,22,27]}]}} options={{plugins:{legend:{display:false}},scales:{y:{ticks:{color:"#fff"}},x:{ticks:{color:"#fff"}}}}} />
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Active Sessions</h3>
              <Line data={{labels:["Jun","Jau","Mo","Apr","May"],datasets:[{borderColor:"#6b9fff",backgroundColor:"rgba(107,159,255,0.1)",fill:true,tension:0.4,data:[10,8,10,13,5]}]}} options={{plugins:{legend:{display:false}},scales:{y:{ticks:{color:"#fff"}},x:{ticks:{color:"#fff"}}}}} />
              <div className="mt-6">
                <h4 className="font-bold mb-3">Threat Level</h4>
                <div className="relative">
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"></div>
                  <div className="absolute top-[-8px] left-[60%] w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-white"></div>
                  <div className="flex justify-between text-xs mt-1"><span>Low</span><span>High</span></div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Recent Alerts</h3>
              <div className="grid grid-cols-3 gap-2 text-xs font-semibold mb-2 pb-2 border-b border-white/20">
                <span>Time</span><span>Status</span><span>Alerts</span>
              </div>
              {[{t:"07.2187.16:21:50",a:"3 hours ago"},{t:"07.2180.14:35:00",a:"5 hours ago"},{t:"07.2168.11:59:84",a:"3 hours ago"},{t:"07.2118.15:51:30",a:"3 hours ago"},{t:"07.2187.12:88:34",a:"1 hours ago"},{t:"07.2167.12:01:39",a:"3 hours ago"},{t:"07.2167.12:91:24",a:"7 hours ago"}].map((a,i)=>(
                <div key={i} className="grid grid-cols-3 gap-2 text-xs py-1">
                  <span>{a.t}</span><span className="text-yellow-400">Warning</span><span className="text-gray-400">{a.a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[#2d1f4d]/50 backdrop-blur rounded-2xl p-8">
          <h3 className="text-xl font-bold mb-4">Global Map</h3>
          <div className="relative">
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" alt="map" className="w-full opacity-60" />
            <div className="absolute top-[35%] left-[15%] text-xs">12.110.16.213</div>
            <div className="absolute top-[25%] left-[48%] text-xs">17.801.58 at<br/>12.49816.68</div>
            <div className="absolute top-[35%] right-[25%] text-xs">1:614.83</div>
            <div className="absolute bottom-[30%] right-[20%] text-xs">0.4523.64</div>
          </div>
        </div>
      </div>
    </div>
  );
}
