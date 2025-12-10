import React from "react";

const Profile = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-[#1a0533] via-[#3b0a68] to-[#5c0faf] p-6 text-white">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold mt-10 mb-6">Profile</h1>

      {/* Glassmorphism Card */}
      <div
        className="
        w-full max-w-lg 
        bg-white/10 backdrop-blur-xl 
        rounded-2xl shadow-xl 
        p-8 flex flex-col items-center
      "
      >
        {/* Avatar */}
        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 mb-6">
          <img
            src="https://i.pravatar.cc/300"
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Full Name */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Full Name</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            <span className="absolute right-3 top-3 text-gray-300 cursor-pointer">
              ✏️
            </span>
          </div>
        </div>

        {/* Email */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Email</label>
          <input
            type="email"
            placeholder="Enter your@email.com"
            className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
              border border-white/20 rounded-lg px-4 py-2 outline-none
              focus:border-pink-400"
          />
        </div>

       {/* Mobile Number */}
<div className="w-full mb-4">
  <label className="text-sm text-gray-200">Mobile Number</label>

  <div className="relative mt-1 flex items-center gap-2">

    {/* Country Code Dropdown */}
    <select
      className="w-28 bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2
                 outline-none focus:border-pink-400 cursor-pointer"
      defaultValue="+91"
    >
      {/* --- FULL COUNTRY CODE LIST --- */}
      <option value="+93" className="text-black">Afghanistan (+93)</option>
      <option value="+355" className="text-black">Albania (+355)</option>
      <option value="+213" className="text-black">Algeria (+213)</option>
      <option value="+1" className="text-black">United States (+1)</option>
      <option value="+376" className="text-black">Andorra (+376)</option>
      <option value="+244" className="text-black">Angola (+244)</option>
      <option value="+54" className="text-black">Argentina (+54)</option>
      <option value="+374" className="text-black">Armenia (+374)</option>
      <option value="+61" className="text-black">Australia (+61)</option>
      <option value="+43" className="text-black">Austria (+43)</option>
      <option value="+994" className="text-black">Azerbaijan (+994)</option>
      <option value="+973" className="text-black">Bahrain (+973)</option>
      <option value="+880" className="text-black">Bangladesh (+880)</option>
      <option value="+375" className="text-black">Belarus (+375)</option>
      <option value="+32" className="text-black">Belgium (+32)</option>
      <option value="+501" className="text-black">Belize (+501)</option>
      <option value="+229" className="text-black">Benin (+229)</option>
      <option value="+975" className="text-black">Bhutan (+975)</option>
      <option value="+591" className="text-black">Bolivia (+591)</option>
      <option value="+387" className="text-black">Bosnia & Herzegovina (+387)</option>
      <option value="+267" className="text-black">Botswana (+267)</option>
      <option value="+55" className="text-black">Brazil (+55)</option>
      <option value="+673" className="text-black">Brunei (+673)</option>
      <option value="+359" className="text-black">Bulgaria (+359)</option>
      <option value="+226" className="text-black">Burkina Faso (+226)</option>
      <option value="+257" className="text-black">Burundi (+257)</option>
      <option value="+855" className="text-black">Cambodia (+855)</option>
      <option value="+237" className="text-black">Cameroon (+237)</option>
      <option value="+1" className="text-black">Canada (+1)</option>
      <option value="+238" className="text-black">Cape Verde (+238)</option>
      <option value="+236" className="text-black">Central African Republic (+236)</option>
      <option value="+235" className="text-black">Chad (+235)</option>
      <option value="+56" className="text-black">Chile (+56)</option>
      <option value="+86" className="text-black">China (+86)</option>
      <option value="+57" className="text-black">Colombia (+57)</option>
      <option value="+269" className="text-black">Comoros (+269)</option>
      <option value="+243" className="text-black">Congo, DR (+243)</option>
      <option value="+242" className="text-black">Congo, Republic (+242)</option>
      <option value="+506" className="text-black">Costa Rica (+506)</option>
      <option value="+385" className="text-black">Croatia (+385)</option>
      <option value="+53" className="text-black">Cuba (+53)</option>
      <option value="+357" className="text-black">Cyprus (+357)</option>
      <option value="+420" className="text-black">Czech Republic (+420)</option>
      <option value="+45" className="text-black">Denmark (+45)</option>
      <option value="+253" className="text-black">Djibouti (+253)</option>
      <option value="+809" className="text-black">Dominican Republic (+809)</option>
      <option value="+593" className="text-black">Ecuador (+593)</option>
      <option value="+20" className="text-black">Egypt (+20)</option>
      <option value="+503" className="text-black">El Salvador (+503)</option>
      <option value="+240" className="text-black">Equatorial Guinea (+240)</option>
      <option value="+291" className="text-black">Eritrea (+291)</option>
      <option value="+372" className="text-black">Estonia (+372)</option>
      <option value="+251" className="text-black">Ethiopia (+251)</option>
      <option value="+679" className="text-black">Fiji (+679)</option>
      <option value="+358" className="text-black">Finland (+358)</option>
      <option value="+33" className="text-black">France (+33)</option>
      <option value="+241" className="text-black">Gabon (+241)</option>
      <option value="+220" className="text-black">Gambia (+220)</option>
      <option value="+995" className="text-black">Georgia (+995)</option>
      <option value="+49" className="text-black">Germany (+49)</option>
      <option value="+233" className="text-black">Ghana (+233)</option>
      <option value="+30" className="text-black">Greece (+30)</option>
      <option value="+299" className="text-black">Greenland (+299)</option>
      <option value="+502" className="text-black">Guatemala (+502)</option>
      <option value="+224" className="text-black">Guinea (+224)</option>
      <option value="+245" className="text-black">Guinea-Bissau (+245)</option>
      <option value="+592" className="text-black">Guyana (+592)</option>
      <option value="+509" className="text-black">Haiti (+509)</option>
      <option value="+504" className="text-black">Honduras (+504)</option>
      <option value="+852" className="text-black">Hong Kong (+852)</option>
      <option value="+36" className="text-black">Hungary (+36)</option>
      <option value="+354" className="text-black">Iceland (+354)</option>
      <option value="+91" className="text-black">India (+91)</option>
      <option value="+62" className="text-black">Indonesia (+62)</option>
      <option value="+98" className="text-black">Iran (+98)</option>
      <option value="+964" className="text-black">Iraq (+964)</option>
      <option value="+353" className="text-black">Ireland (+353)</option>
      <option value="+972" className="text-black">Israel (+972)</option>
      <option value="+39" className="text-black">Italy (+39)</option>
      <option value="+81" className="text-black">Japan (+81)</option>
      <option value="+962" className="text-black">Jordan (+962)</option>
      <option value="+7" className="text-black">Kazakhstan (+7)</option>
      <option value="+254" className="text-black">Kenya (+254)</option>
      <option value="+850" className="text-black">North Korea (+850)</option>
      <option value="+82" className="text-black">South Korea (+82)</option>
      <option value="+965" className="text-black">Kuwait (+965)</option>
      <option value="+996" className="text-black">Kyrgyzstan (+996)</option>
      <option value="+856" className="text-black">Laos (+856)</option>
      <option value="+371" className="text-black">Latvia (+371)</option>
      <option value="+961" className="text-black">Lebanon (+961)</option>
      <option value="+266" className="text-black">Lesotho (+266)</option>
      <option value="+231" className="text-black">Liberia (+231)</option>
      <option value="+218" className="text-black">Libya (+218)</option>
      <option value="+423" className="text-black">Liechtenstein (+423)</option>
      <option value="+370" className="text-black">Lithuania (+370)</option>
      <option value="+352" className="text-black">Luxembourg (+352)</option>
      <option value="+853" className="text-black">Macau (+853)</option>
      <option value="+389" className="text-black">North Macedonia (+389)</option>
      <option value="+261" className="text-black">Madagascar (+261)</option>
      <option value="+265" className="text-black">Malawi (+265)</option>
      <option value="+60" className="text-black">Malaysia (+60)</option>
      <option value="+960" className="text-black">Maldives (+960)</option>
      <option value="+223" className="text-black">Mali (+223)</option>
      <option value="+356" className="text-black">Malta (+356)</option>
      <option value="+692" className="text-black">Marshall Islands (+692)</option>
      <option value="+596" className="text-black">Martinique (+596)</option>
      <option value="+222" className="text-black">Mauritania (+222)</option>
      <option value="+230" className="text-black">Mauritius (+230)</option>
      <option value="+52" className="text-black">Mexico (+52)</option>
      <option value="+691" className="text-black">Micronesia (+691)</option>
      <option value="+373" className="text-black">Moldova (+373)</option>
      <option value="+377" className="text-black">Monaco (+377)</option>
      <option value="+976" className="text-black">Mongolia (+976)</option>
      <option value="+382" className="text-black">Montenegro (+382)</option>
      <option value="+212" className="text-black">Morocco (+212)</option>
      <option value="+258" className="text-black">Mozambique (+258)</option>
      <option value="+95" className="text-black">Myanmar (+95)</option>
      <option value="+264" className="text-black">Namibia (+264)</option>
      <option value="+977" className="text-black">Nepal (+977)</option>
      <option value="+31" className="text-black">Netherlands (+31)</option>
      <option value="+64" className="text-black">New Zealand (+64)</option>
      <option value="+505" className="text-black">Nicaragua (+505)</option>
      <option value="+227" className="text-black">Niger (+227)</option>
      <option value="+234" className="text-black">Nigeria (+234)</option>
      <option value="+47" className="text-black">Norway (+47)</option>
      <option value="+968" className="text-black">Oman (+968)</option>
      <option value="+92" className="text-black">Pakistan (+92)</option>
      <option value="+680" className="text-black">Palau (+680)</option>
      <option value="+507" className="text-black">Panama (+507)</option>
      <option value="+675" className="text-black">Papua New Guinea (+675)</option>
      <option value="+595" className="text-black">Paraguay (+595)</option>
      <option value="+51" className="text-black">Peru (+51)</option>
      <option value="+63" className="text-black">Philippines (+63)</option>
      <option value="+48" className="text-black">Poland (+48)</option>
      <option value="+351" className="text-black">Portugal (+351)</option>
      <option value="+974" className="text-black">Qatar (+974)</option>
      <option value="+40" className="text-black">Romania (+40)</option>
      <option value="+7" className="text-black">Russia (+7)</option>
      <option value="+250" className="text-black">Rwanda (+250)</option>
      <option value="+966" className="text-black">Saudi Arabia (+966)</option>
      <option value="+221" className="text-black">Senegal (+221)</option>
      <option value="+381" className="text-black">Serbia (+381)</option>
      <option value="+248" className="text-black">Seychelles (+248)</option>
      <option value="+232" className="text-black">Sierra Leone (+232)</option>
      <option value="+65" className="text-black">Singapore (+65)</option>
      <option value="+421" className="text-black">Slovakia (+421)</option>
      <option value="+386" className="text-black">Slovenia (+386)</option>
      <option value="+677" className="text-black">Solomon Islands (+677)</option>
      <option value="+252" className="text-black">Somalia (+252)</option>
      <option value="+27" className="text-black">South Africa (+27)</option>
      <option value="+34" className="text-black">Spain (+34)</option>
      <option value="+94" className="text-black">Sri Lanka (+94)</option>
      <option value="+249" className="text-black">Sudan (+249)</option>
      <option value="+597" className="text-black">Suriname (+597)</option>
      <option value="+268" className="text-black">Eswatini (+268)</option>
      <option value="+46" className="text-black">Sweden (+46)</option>
      <option value="+41" className="text-black">Switzerland (+41)</option>
      <option value="+963" className="text-black">Syria (+963)</option>
      <option value="+886" className="text-black">Taiwan (+886)</option>
      <option value="+992" className="text-black">Tajikistan (+992)</option>
      <option value="+255" className="text-black">Tanzania (+255)</option>
      <option value="+66" className="text-black">Thailand (+66)</option>
      <option value="+228" className="text-black">Togo (+228)</option>
      <option value="+676" className="text-black">Tonga (+676)</option>
      <option value="+216" className="text-black">Tunisia (+216)</option>
      <option value="+90" className="text-black">Turkey (+90)</option>
      <option value="+993" className="text-black">Turkmenistan (+993)</option>
      <option value="+256" className="text-black">Uganda (+256)</option>
      <option value="+380" className="text-black">Ukraine (+380)</option>
      <option value="+971" className="text-black">UAE (+971)</option>
      <option value="+44" className="text-black">United Kingdom (+44)</option>
      <option value="+598" className="text-black">Uruguay (+598)</option>
      <option value="+998" className="text-black">Uzbekistan (+998)</option>
      <option value="+678" className="text-black">Vanuatu (+678)</option>
      <option value="+379" className="text-black">Vatican (+379)</option>
      <option value="+58" className="text-black">Venezuela (+58)</option>
      <option value="+84" className="text-black">Vietnam (+84)</option>
      <option value="+967" className="text-black">Yemen (+967)</option>
      <option value="+260" className="text-black">Zambia (+260)</option>
      <option value="+263" className="text-black">Zimbabwe (+263)</option>
    </select>

    {/* Phone Number Input */}
    <input
      type="tel"
      placeholder="Enter mobile number"
      className="flex-1 bg-white/10 text-white placeholder-gray-300 
                 border border-white/20 rounded-lg px-4 py-2 outline-none 
                 focus:border-pink-400"
    />
  </div>
</div>


        {/* Password */}
        <div className="w-full mb-4">
          <label className="text-sm text-gray-200">Password</label>
          <div className="relative">
            <input
              type="password"
              placeholder="Old Password"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            <span className="absolute right-3 top-3 text-gray-300 cursor-pointer">
              ✏️
            </span>
          </div>

          <div className="relative mt-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full mt-1 bg-white/10 text-white placeholder-gray-300 
                border border-white/20 rounded-lg px-4 py-2 outline-none
                focus:border-pink-400"
            />
            <span className="absolute right-3 top-3 text-gray-300 cursor-pointer">
              ✏️
            </span>
          </div>
        </div>

        {/* Save Button */}
        <button
          className="
          w-full py-3 rounded-lg text-white font-semibold
          bg-gradient-to-r from-purple-500 to-pink-500 
          hover:opacity-90 transition
        "
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;
